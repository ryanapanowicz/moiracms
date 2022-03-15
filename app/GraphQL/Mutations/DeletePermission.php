<?php

namespace App\GraphQL\Mutations;

use App\Models\Permission;

class DeletePermission
{
    /**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        $permission = Permission::findOrFail($args['id']);
        
        if ($permission->delete()) {
            return ['permission' => $permission];
        }
    }
}