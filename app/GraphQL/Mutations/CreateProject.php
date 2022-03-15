<?php

namespace App\GraphQL\Mutations;

use App\Models\Project;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CreateProject
{
    /**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        $user = Auth::guard('api')->user();

        try {
            DB::beginTransaction();

            $project = new Project;
            $project->fill($args);
            $project->user_id = $user->id;
            $project->save();

            if (isset($args["assets"]) and is_array($args["assets"])) {
                $project->assets()->sync($args["assets"]);
            }

            DB::commit();

            return ['project' => $project];
        } catch (Exception $e) {
            DB::rollBack();
            return $e;
        }
    }
}
