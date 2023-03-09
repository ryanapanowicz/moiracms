<?php

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class Upload
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $modelKey = strtolower($args['ref'] ?? 'default');
        $modelClass = config("moiracms.media_models.$modelKey");
        $model = app($modelClass);

        if (!$this->isAttachableModel($model)) {
            throw new \Exception(__("Cannot attach file to this ref."));
        }

        try {
            $modelOwner = $model->findOrFail($args['ref_id']);

            if (!$this->canUpload($modelOwner)) {
                throw new \Exception(__("Can't upload if you are not the owner of ref."));
            }

            $files = $args['files'];
            $properties = $args['info'] ?? [];
            $responsive = $args['responsive'] ?? false;
            $media = [];

            foreach ($files as $file) {
                $name = $properties['name'] ?? pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                if (isset($properties['name'])) unset($properties['name']);

                $media[] = $modelOwner
                    ->addMedia($file)
                    ->usingName($name)
                    ->withCustomProperties($properties)
                    ->withResponsiveImagesIf($responsive)
                    ->toMediaCollection()
                    ->refresh();
            }

            return $media;
        } catch (ModelNotFoundException $e) {
            throw new \Exception(__("Can't find ref by ref_id: ") . $args['ref_id']);
        } catch (\Exception $e) {
            Log::error($e);
            throw new \Exception(__("Was unable to upload the file because of a server error."));
        }
    }

    protected function isAttachableModel($model): bool
    {
        return in_array($model::class, config("moiracms.media_models", [Auth::user()::class]));
    }

    protected function canUpload($model): bool
    {
        $user = Auth::user();
        $ownerKey = null;

        if (get_class($model) === get_class($user)) {
            $ownerKey = $model->id;
        } elseif (property_exists($model, 'user_id')) {
            $ownerKey = $model->user_id;
        }

        if (!is_null($user) and $ownerKey === $user->id) {
            return true;
        }

        return false;
    }
}
