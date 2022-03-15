<?php

namespace App\GraphQL\Mutations;

use App\Models\Media;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UpdateAssetInfo
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        try {
            $file = Media::findOrFail($args['id']);

            if (!empty($args['name'])) {
                $file->name = $args['name'];
            }

            if (!empty($args['alternative_text'])) {
                $file->setCustomProperty('alternative_text', $args['alternative_text']);
            }

            if (!empty($args['caption'])) {
                $file->setCustomProperty('caption', $args['caption']);
            }

            $file->save();

            return ['asset' => $file];
        } catch (ModelNotFoundException $e) {
            throw new Exception(__("Can't find asset with ID: ") . $args['id']);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    protected function sanitizeFileName($string): string
    {
        return strtolower(str_replace(['#', '/', '\\', ' '], '-', $string));
    }
}
