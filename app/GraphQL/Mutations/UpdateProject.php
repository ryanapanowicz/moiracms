<?php

namespace App\GraphQL\Mutations;

use App\Models\Project;
use Exception;
use Illuminate\Support\Facades\DB;

class UpdateProject
{
    /**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        try {
            DB::beginTransaction();

            $project = Project::findOrFail($args["id"]);;
            $project->fill($args);
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
