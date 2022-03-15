<?php

namespace App\GraphQL\Mutations;

use App\Models\Role;

class RevokePermissionToRole
{
    /**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        $pemissions = array_map('strtolower', $args['permission']);
        $role = Role::findByName(strtolower($args['role']));
        $role->revokePermissionTo($pemissions);

        return ['role' => $role];
    }
}