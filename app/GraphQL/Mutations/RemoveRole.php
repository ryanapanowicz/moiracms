<?php

namespace App\GraphQL\Mutations;

use App\Models\Role;
use App\Models\User;

class RemoveRole
{
    /**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        $user = User::findOrFail($args['user_id']);
        $role = Role::findByName($args['role']);
        $user->removeRole($role);

        return ['role' => $role];
    }
}