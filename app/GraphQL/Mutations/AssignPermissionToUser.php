<?php

namespace App\GraphQL\Mutations;

use App\Models\User;

class AssignPermissionToUser
{
    /**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        $pemissions = array_map('strtolower', $args['permission']);
        $user = User::findOrFail($args['user_id']);
        $user->givePermissionTo($pemissions);

        return ['user' => $user];
    }
}