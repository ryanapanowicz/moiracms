<?php

namespace App\GraphQL\Mutations;

use Exception;
use App\Models\Project;
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
            
            // Attach featured image if it exists
            if (array_key_exists('featured', $args)) {
                $project->featured_id = $args['featured'];
            }

            $project->save();

            // Attach attachments if they exist
            if (isset($args["assets"]) and is_array($args["assets"])) {
                // Add order_id using sorted index of assets
                $assets = array_map(function($value, $index) {
                    return ['media_id' => $value, 'order_id' => $index];
                }, array_values($args["assets"]), array_keys($args["assets"]));

                // To keep the SQL calls short, just detach
                // everything and then reattach the new assets.
                // This is not the best solution, but keeps things
                // simple for now.
                $project->assets()->detach();
                $project->assets()->attach($assets);
            }

            DB::commit();

            return ['project' => $project];
        } catch (Exception $e) {
            DB::rollBack();
            return $e;
        }
    }
}
