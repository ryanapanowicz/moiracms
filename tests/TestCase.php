<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Passport\ClientRepository;
use Laravel\Passport\Passport;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;
    use MakesGraphQLRequests;

    public function setUp(): void
    {
        parent::setUp();

        // disable debug errors and stacktrace
        config()->set('lighthouse.debug', 0);
    }

    /**
     * Create a passport client for testing.
     */
    public function createClient(): void
    {
        $client = app(ClientRepository::class)->createPasswordGrantClient(null, 'test', 'http://localhost');
        config()->set('lighthouse-graphql-passport.client_id', $client->id);
        config()->set('lighthouse-graphql-passport.client_secret', $client->secret);
    }

    public function createAuth(): User
    {
        $this->createClient();
        $authUser = User::factory()->create()->first();
        Passport::actingAs($authUser);

        return $authUser;
    }

    public function createAuthAdmin(): User
    {
        $authUser = $this->createAuth();
        $authUser->assignRole('admin');

        return $authUser;
    }
}
