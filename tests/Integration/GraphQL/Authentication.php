<?php

namespace Tests\Integration\GraphQL;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Testing\RefreshDatabase;

class Authentication extends TestCase
{
    use RefreshDatabase;

    /**
     * Test Unauthenticated GraphQL query
     * 
     */
    public function testUnauthenticatedThrowsError(): void
    {
        $this->graphQL(
        /** @lang GraphQL */
        '
        query {
            users {
                data {
                    id
                    name
                    email
                    created_at
                    updated_at
                    avatar
                }
            }
        }
        ')->assertGraphQLErrorMessage('Unauthenticated.');
    }

    /**
     * Test all Users GraphQL query
     *
     * @return void
     */
    public function testQueryUsers(): void
    {
        $admin = $this->createAuthAdmin();

        $user = User::factory()->create();

        $this->graphQL(
        /** @lang GraphQL */
        '
        query {
            users {
                data {
                    id
                    name
                    email
                    created_at
                    updated_at
                    avatar
                }
            }
        }
        ')->assertJson([
            'data' => [
                'users' => [
                    'data' => [
                        [
                            'id'                => $admin->id,
                            'name'              => $admin->name,
                            'email'             => $admin->email,
                            'created_at'        => $admin->created_at,
                            'updated_at'        => $admin->updated_at,
                            'avatar'            => $admin->avatar
                        ],
                        [
                            'id'                => $user->id,
                            'name'              => $user->name,
                            'email'             => $user->email,
                            'created_at'        => $user->created_at,
                            'updated_at'        => $user->updated_at,
                            'avatar'            => $user->avatar
                        ]
                    ]
                ]
            ]
        ]);
    }

    /**
     * Test single User GraphQL query
     * 
     */
    public function testQueryUser(): void
    {
        $this->createAuthAdmin();

        $user = User::factory()->create();

        $this->graphQL(
        /** @lang GraphQL */
        '
        query {
            user(id: "' . $user->id . '") {
                id
                name
                email
                created_at
                updated_at
                avatar
            }
        }
        ')->assertJson([
            'data' => [
                'user' => [
                    'id'                => $user->id,
                    'name'              => $user->name,
                    'email'             => $user->email,
                    'created_at'        => $user->created_at,
                    'updated_at'        => $user->updated_at,
                    'avatar'            => $user->avatar
                ]
            ]
        ]);
    }

    /**
     * Test get Authenticated User GraphQL query
     * 
     */
    public function testQueryMe(): void
    {
        $admin = $this->createAuthAdmin();

        $this->graphQL(
        /** @lang GraphQL */
        '
        query {
            me {
                id
                name
                email
                avatar
            }
        }
        ')->assertJson([
            'data' => [
                'me' => [
                    'id'                => $admin->id,
                    'name'              => $admin->name,
                    'email'             => $admin->email,
                    'avatar'            => $admin->avatar
                ]
            ]
        ]);
    }

    /**
     * Test create user GraphQL mutation
     * 
     */
    public function testMutationCreateUser(): void
    {
        Event::fake([Registered::class]);

        $this->createAuthAdmin();

        $response = $this->graphQL(
        /** @lang GraphQL */
        '
        mutation {
            createUser(input: {
                name: "Test User",
                email: "test@moiracms.com",
                password: "password",
                password_confirmation: "password"
            }) {
                user {
                    id
                    name
                    email
                    created_at
                    updated_at
                    avatar
                }
            }
        }
        ');

        $user = User::all()->last();

        $response->assertJson([
            'data' => [
                'createUser' => [
                    'user' => [
                        'id'                => $user->id,
                        'name'              => $user->name,
                        'email'             => $user->email,
                        'created_at'        => $user->created_at,
                        'updated_at'        => $user->updated_at,
                        'avatar'            => $user->avatar
                    ]
                ]
            ]
        ]);
        
        Event::assertDispatched(Registered::class);
    }

    /**
     * Test update user GraphQL mutation
     * 
     */
    public function testMutationUpdateUser(): void
    {

        $admin = $this->createAuthAdmin();

        $response = $this->graphQL(
        /** @lang GraphQL */
        '
        mutation {
            updateUser(id: "' . $admin->id . '", input: {
                name: "Test User",
                email: "test@moiracms.com",
                password: "password",
                password_confirmation: "password"
            }) {
                user {
                    id
                    name
                    email
                    created_at
                    updated_at
                    avatar
                }
            }
        }
        ');

        $user = User::all()->last();

        $response->assertJson([
            'data' => [
                'updateUser' => [
                    'user' => [
                        'id'                => $user->id,
                        'name'              => $user->name,
                        'email'             => $user->email,
                        'created_at'        => $user->created_at,
                        'updated_at'        => $user->updated_at,
                        'avatar'            => $user->avatar
                    ]
                ]
            ]
        ]);
    }

    /**
     * Test delete user GraphQL mutation
     * 
     */
    public function testMutationDeleteUser(): void
    {

        $admin = $this->createAuthAdmin();
        $adminCopy = (object) $admin;

        $response = $this->graphQL(
        /** @lang GraphQL */
        '
        mutation {
            deleteUser(id: "' . $admin->id . '") {
                user {
                    id
                    name
                    email
                    created_at
                    updated_at
                    avatar
                }
            }
        }
        ');

        $this->assertDatabaseMissing($admin->getTable(), ['id' => $adminCopy->id]);

        $response->assertJson([
            'data' => [
                'deleteUser' => [
                    'user' => [
                        'id'                => $adminCopy->id,
                        'name'              => $adminCopy->name,
                        'email'             => $adminCopy->email,
                        'created_at'        => $adminCopy->created_at,
                        'updated_at'        => $adminCopy->updated_at,
                        'avatar'            => $adminCopy->avatar
                    ]
                ]
            ]
        ]);
    }
}
