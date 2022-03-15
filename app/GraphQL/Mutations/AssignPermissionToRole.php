<?php

namespace App\GraphQL\Mutations;

use App\Models\Role;

class AssignPermissionToRole
{
    /**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        $pemissions = array_map('strtolower', $args['permission']);
        $role = Role::findByName(strtolower($args['role']));
        $role->givePermissionTo($pemissions);
        
        return ['role' => $role];
    }
}