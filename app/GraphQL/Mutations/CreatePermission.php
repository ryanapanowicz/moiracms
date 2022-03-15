<?php

namespace App\GraphQL\Mutations;

use App\Models\Permission;

class CreatePermission
{
	/**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        $name = strtolower($args['name']);
        $permission = Permission::create(['name' => $name]);

        return ['permission' => $permission];
    }
}