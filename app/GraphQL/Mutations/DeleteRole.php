<?php

namespace App\GraphQL\Mutations;

use App\Models\Role;

class DeleteRole
{
    /**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        $role = Role::findOrFail($args['id']);
        
        if ($role->delete()) {
            return ['role' => $role];
        }
    }
}