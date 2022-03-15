<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Nuwave\Lighthouse\Events\BuildSchemaString;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        // Add schema for media
        app('events')->listen(
            BuildSchemaString::class,
            function (): string {
                return file_get_contents(__DIR__.'/../../graphql/media.graphql');
            }
        );
    }
}
