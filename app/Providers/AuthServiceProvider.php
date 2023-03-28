<?php

namespace App\Providers;

use Laravel\Passport\Client;
use Laravel\Passport\Passport;
use Illuminate\Support\Facades\Gate;
use App\Observers\AuthClientObserver;
use Nuwave\Lighthouse\Events\BuildSchemaString;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [];

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        // Disable Laravel Passport Migrations
        Passport::ignoreMigrations();
    }

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        // Implicitly grant "Super Admin" role all permissions
        Gate::before(function ($user, $ability) {
            return $user->hasRole("super admin") ? true : null;
        });

        // Handle AuthClient Uuid
        Client::observe(AuthClientObserver::class);

        // Add schema for user roles and permissions
        app("events")->listen(BuildSchemaString::class, function (): string {
            return file_get_contents(
                __DIR__ . "/../../graphql/permission.graphql"
            );
        });

        ResetPassword::createUrlUsing(function ($user, string $token): string {
            return env("APP_CLIENT_URL") . "/password/reset/" . $token;
        });
    }
}