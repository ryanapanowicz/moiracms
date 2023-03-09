<?php

namespace Tests;

use App\Models\User;
use Laravel\Passport\Passport;
use Illuminate\Http\Testing\File;
use Laravel\Passport\ClientRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;
    use MakesGraphQLRequests;

    public function setUp(): void
    {
        parent::setUp();

        Storage::fake('media');
        config()->set('filesystems.disks.media', [
            'driver' => 'local',
            'root' => storage_path('app/media'),
        ]);

        config()->set('media-library.disk_name', 'media');

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

    /**
     * Create a mock photos in the DB
     * 
     */
    protected function generatePhoto(Model $model): Model
    {
        return $model
            ->addMedia(File::image('photo.jpg'))
            ->usingName("Test Photo")
            ->withCustomProperties(["alternative_text" => "test", "caption" => "test"])
            ->withResponsiveImagesIf(true)
            ->toMediaCollection()
            ->refresh();
    }
}