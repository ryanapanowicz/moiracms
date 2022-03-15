<?php

namespace App\GraphQL\Mutations;

use App\Models\User;

class AssignRole
{
    /**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        $user = User::findOrFail($args['user_id']);
        $user->assignRole(strtolower($args['role']));
        
        return ['user' => $user];
    }
}