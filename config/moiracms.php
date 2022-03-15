<?php

return [

	/*
    |--------------------------------------------------------------------------
    | Default roles and permissions 
    |--------------------------------------------------------------------------
    |
    | This defines the default roles and permissions that are set on migrations.
    |
     */
    'permissions' => [
        'admin' => [
            // User Permissions
            'view users',
            'create users',
            'edit users',
            'delete users',
            // Roles Permissions
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
            'assign roles',
            'revoke roles',
            // Permission Permissions
            'view permissions',
            'create permissions',
            'edit permissions',
            'delete permissions',
            'assign permissions',
            'revoke permissions',
            // Asset Permissions
            'upload assets',
            'edit assets',
            'delete assets',
            // Project Permissions
            'create projects',
            'edit projects',
            'delete projects'
        ],
        'editor' => [
            // User Permissions
            'view users',
            // Roles Permissions
            'view roles',
            // Permission Permissions
            'view permissions',
            // Asset Permissions
            'upload assets',
            'edit assets',
            'delete assets',
            // Project Permissions
            'create projects',
            'edit projects',
            'delete projects'
        ]
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Media modals
    |--------------------------------------------------------------------------
    |
    | This defines the default models that media can attach to.
    |
     */
    'media_models' => [
        'default' => config('auth.providers.users.model')
    ]
];
