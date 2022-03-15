<?php

namespace App\GraphQL\Mutations;

use App\Models\Role;

class CreateRole
{
    /**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        $name = strtolower($args['name']);
        $role = Role::create(['name' => $name]);

        return ['role' => $role];
    }
}