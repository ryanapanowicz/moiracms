<?php

namespace App\GraphQL\Mutations;

use App\Models\User;

class DeleteUser
{
    /**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        $user = User::findOrFail($args['id']);
        $response = (object) $user;

        if ($user->delete()) {
            return ['user' => $response];
        }
    }
}