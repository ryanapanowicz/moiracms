<?php

namespace Tests\Integration\GraphQL;

use Tests\TestCase;
use App\Models\Role;
use App\Models\User;
use App\Models\Permission;
use Illuminate\Support\Arr;
use Illuminate\Foundation\Testing\RefreshDatabase;

class Permissions extends TestCase
{
    use RefreshDatabase;

    /**
     * Test Unauthenticated GraphQL query
     * 
     */
    public function testMissingPermissionsThrowsError(): void
    {
        $authUser = $this->createAuth();
        $role = Role::create(['name' => 'tester']);
        $permission = Permission::create(['name' => 'testing']);
        $role->givePermissionTo($permission);
        $authUser->assignRole('tester');

        $this->assertDatabaseHas($role->getTable(), ['name' => 'tester']);
        $this->assertDatabaseHas($permission->getTable(), ['name' => 'testing']);

        // Query requires "view roles" permission.
        $this->graphQL(/** @lang GraphQL */ '
        query {
            roles {
                data {
                    id
                    name
                    guard_name
                }
            }
        }
        ')->assertGraphQLErrorMessage('Authorization exception');
    }

    /**
     * Test all Roles GraphQL query
     * 
     */
    public function testQueryRoles(): void
    {
        $this->createAuthAdmin();

        $count = config('lighthouse.pagination.default_count');

        // Only grab default pagination amount.
        $roles = Role::select(['id', 'name', 'guard_name'])
            ->take($count)
            ->get();

        $this->graphQL(/** @lang GraphQL */ '
        query {
            roles {
                data {
                    id
                    name
                    guard_name
                }
            }
        }
        ')->assertJson([
            'data' => [
                'roles' => [
                    'data' => $roles->toArray()
                ]
            ]
        ]);
    }

    /**
     * Test single Role GraphQL query
     * 
     */
    public function testQueryRole(): void
    {
        $this->createAuthAdmin();

        $role = Role::latest()
            ->select(['id', 'name', 'guard_name'])
            ->first();

        $this->graphQL(/** @lang GraphQL */ '
        query {
            role(id: "'.$role->id.'") {
                id
                name
                guard_name
            }
        }
        ')->assertJson([
            'data' => [
                'role' => $role->toArray()
            ]
        ]);
    }

    /**
     * Test all Permissions GraphQL query
     * 
     */
    public function testQueryPermissions(): void
    {
        $this->createAuthAdmin();

        $count = config('lighthouse.pagination.default_count');

        // Only grab default pagination amount.
        $permissions = Permission::select(['id', 'name', 'guard_name'])
            ->take($count)
            ->get();

        $this->graphQL(/** @lang GraphQL */ '
        query {
            permissions {
                data {
                    id
                    name
                    guard_name
                }
            }
        }
        ')->assertJson([
            'data' => [
                'permissions' => [
                    'data' => $permissions->toArray()
                ]
            ]
        ]);
    }

    /**
     * Test single Permission GraphQL query
     * 
     */
    public function testQueryPermission(): void
    {
        $this->createAuthAdmin();

        $permission = Permission::latest()
            ->select(['id', 'name', 'guard_name'])
            ->first();

        $this->graphQL(/** @lang GraphQL */ '
        query {
            permission(id: "'.$permission['id'].'") {
                id
                name
                guard_name
            }
        }
        ')->assertJson([
            'data' => [
                'permission' => $permission->toArray()
            ]
        ]);
    }

    /**
     * Test create role GraphQL mutation
     * 
     */
    public function testMutationCreateRole()
    {
        $this->createAuthAdmin();

        $response = $this->graphQL(/** @lang GraphQL */ '
        mutation {
            createRole(input: {name: "tester"}) {
                role {
                    id
                    name
                    guard_name
                }
            }
        }
        ');

        $role = Role::latest('id')
            ->select(['id', 'name', 'guard_name'])
            ->first();

        $response->assertJson([
            'data' => [
                'createRole' => [
                    'role' => $role->toArray()
                ]
            ]
        ]);
    }

    /**
     * Test delete role GraphQL mutation
     * 
     */
    public function testMutationDeleteRole(): void
    {

        $this->createAuthAdmin();

        $role = Role::create(['name' => 'tester']);

        $this->graphQL(/** @lang GraphQL */ '
        mutation {
            deleteRole(id: "'.$role->id.'") {
                role {
                    id
                    name
                    guard_name
                }
            }
        }
        ')->assertJson([
            'data' => [
                'deleteRole' => [
                    'role' => Arr::only($role->toArray(), ['id', 'name', 'guard_name'])
                ]
            ]
        ]);

        $this->assertDatabaseMissing($role->getTable(), ['id' => $role->id]);

    }

    /**
     * Test assign role GraphQL mutation
     * 
     */
    public function testMutationAssignRole()
    {
        $admin = $this->createAuthAdmin();

        $role = Role::create(['name' => 'tester']);

        $this->graphQL(/** @lang GraphQL */ '
        mutation {
            assignRole(input: {user_id: "'.$admin->id.'", role: "tester"}) {
                user {
                    id
                    name
                    email
                }
            }
        }
        ')->assertJson([
            'data' => [
                'assignRole' => [
                    'user' => Arr::only($admin->toArray(), ['id', 'name', 'email'])
                ]
            ]
        ]);

        $this->assertDatabaseHas('model_has_roles', [
            'role_id'    => $role->id,
            'model_type' => User::class,
            'model_uuid' => $admin->id
        ]);
    }

    /**
     * Test revoke permission to role GraphQL mutation
     * 
     */
    public function testMutationRevokePermissionToRole()
    {
        $this->createAuthAdmin();
        $role = Role::create(['name' => 'tester']);
        $permission = Permission::create(['name' => 'testing']);
        $role->givePermissionTo($permission);

        $this->assertDatabaseHas($role->getTable(), ['name' => 'tester']);
        $this->assertDatabaseHas($permission->getTable(), ['name' => 'testing']);
        $this->assertDatabaseHas('role_has_permissions', [
            'permission_id' => $permission->id,
            'role_id'       => $role->id
        ]);

        $this->graphQL(/** @lang GraphQL */ '
        mutation {
            revokePermissionToRole(input: {role: "tester", permission: "testing"}) {
                role {
                    id
                    name
                    guard_name
                }
            }
        }
        ')->assertJson([
            'data' => [
                'revokePermissionToRole' => [
                    'role' => Arr::only($role->toArray(), ['id', 'name', 'guard_name'])
                ]
            ]
        ]);

        $this->assertDatabaseMissing('role_has_permissions', [
            'permission_id' => $permission->id,
            'role_id'       => $role->id
        ]);
    }

    /**
     * Test remove role GraphQL mutation
     * 
     */
    public function testMutationRemoveRole()
    {
        $admin = $this->createAuthAdmin();
        $role = Role::create(['name' => 'tester']);
        $admin->assignRole('tester');

        $this->assertDatabaseHas($role->getTable(), ['name' => 'tester']);

        $this->graphQL(/** @lang GraphQL */ '
        mutation {
            removeRole(input: {user_id: "'.$admin->id.'", role: "tester"}) {
                role {
                    id
                    name
                    guard_name
                }
            }
        }
        ')->assertJson([
            'data' => [
                'removeRole' => [
                    'role' => Arr::only($role->toArray(), ['id', 'name', 'guard_name'])
                ]
            ]
        ]);

        $this->assertDatabaseMissing('model_has_roles', [
            'role_id'    => $role->id,
            'model_type' => User::class,
            'model_uuid' => $admin->id
        ]);
    }

    /**
     * Test create permission GraphQL mutation
     * 
     */
    public function testMutationCreatePermission()
    {
        $this->createAuthAdmin();

        $response = $this->graphQL(/** @lang GraphQL */ '
        mutation {
            createPermission(input: {name: "testing"}) {
                permission {
                    id
                    name
                    guard_name
                }
            }
        }
        ');

        $permission = Permission::latest('id')
            ->select(['id', 'name', 'guard_name'])
            ->first();

        $response->assertJson([
            'data' => [
                'createPermission' => [
                    'permission' => $permission->toArray()
                ]
            ]
        ]);
    }

    /**
     * Test delete permission GraphQL mutation
     * 
     */
    public function testMutationDeletePermission(): void
    {

        $this->createAuthAdmin();

        $permission = permission::create(['name' => 'testing']);

        $this->graphQL(/** @lang GraphQL */ '
        mutation {
            deletePermission(id: "'.$permission->id.'") {
                permission {
                    id
                    name
                    guard_name
                }
            }
        }
        ')->assertJson([
            'data' => [
                'deletePermission' => [
                    'permission' => Arr::only($permission->toArray(), ['id', 'name', 'guard_name'])
                ]
            ]
        ]);

        $this->assertDatabaseMissing($permission->getTable(), ['id' => $permission->id]);
    }

    /**
     * Test assign permission to user GraphQL mutation
     * 
     */
    public function testMutationAssignPermissionToUser()
    {
        $admin = $this->createAuthAdmin();

        $permission = Permission::create(['name' => 'testing']);

        $this->graphQL(/** @lang GraphQL */ '
        mutation {
            assignPermissionToUser(input: {user_id: "'.$admin->id.'", permission: "testing"}) {
                user {
                    id
                    name
                    email
                }
            }
        }
        ')->assertJson([
            'data' => [
                'assignPermissionToUser' => [
                    'user' => Arr::only($admin->toArray(), ['id', 'name', 'email'])
                ]
            ]
        ]);

        $this->assertDatabaseHas('model_has_permissions', [
            'permission_id' => $permission->id,
            'model_type'    => User::class,
            'model_uuid'    => $admin->id
        ]);
    }

    /**
     * Test assign permission to role GraphQL mutation
     * 
     */
    public function testMutationAssignPermissionToRole()
    {
        $this->createAuthAdmin();
        $role = Role::create(['name' => 'tester']);
        $permission = Permission::create(['name' => 'testing']);

        $this->graphQL(/** @lang GraphQL */ '
        mutation {
            assignPermissionToRole(input: {role: "tester", permission: "testing"}) {
                role {
                    id
                    name
                    guard_name
                }
            }
        }
        ')->assertJson([
            'data' => [
                'assignPermissionToRole' => [
                    'role' => Arr::only($role->toArray(), ['id', 'name', 'guard_name'])
                ]
            ]
        ]);

        $this->assertDatabaseHas('role_has_permissions', [
            'permission_id' => $permission->id,
            'role_id'       => $role->id
        ]);
    }

    /**
     * Test revoke permission to user GraphQL mutation
     * 
     */
    public function testMutationRevokePermissionToUser()
    {
        $admin = $this->createAuthAdmin();
        $permission = Permission::create(['name' => 'testing']);
        $admin->givePermissionTo($permission);

        $this->assertDatabaseHas($permission->getTable(), ['name' => 'testing']);
        $this->assertDatabaseHas('model_has_permissions', [
            'permission_id' => $permission->id,
            'model_type'    => User::class,
            'model_uuid'    => $admin->id
        ]);

        $this->graphQL(/** @lang GraphQL */ '
        mutation {
            revokePermissionToUser(input: {user_id: "'.$admin->id.'", permission: "testing"}) {
                user {
                    id
                    name
                    email
                }
            }
        }
        ')->assertJson([
            'data' => [
                'revokePermissionToUser' => [
                    'user' => Arr::only($admin->toArray(), ['id', 'name', 'email'])
                ]
            ]
        ]);

        $this->assertDatabaseMissing('model_has_permissions', [
            'permission_id' => $permission->id,
            'model_type'    => User::class,
            'model_uuid'    => $admin->id
        ]);
    }
}
