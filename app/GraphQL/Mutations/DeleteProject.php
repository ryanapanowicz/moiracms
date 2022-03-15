<?php

namespace App\GraphQL\Mutations;

use App\Models\Project;

class DeleteProject
{
    /**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        $project = Project::findOrFail($args['id']);
        $response = (object) $project;

        if ($project->delete()) {
            return ['project' => $response];
        }
    }
}