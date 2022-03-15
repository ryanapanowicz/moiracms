<?php

namespace App\GraphQL\Mutations;

use App\Models\Media;

class DeleteAsset
{
    /**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        $asset = Media::findOrFail($args['id']);
        
        if ($asset->delete()) {
            return ['asset' => $asset];
        }
    }
}