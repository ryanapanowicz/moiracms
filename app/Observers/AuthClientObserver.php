<?php

namespace App\Observers;

use Facades\Str;
use Laravel\Passport\Client;

class AuthClientObserver
{
    public function creating(Client $client)
    {
        $client->incrementing = false;
        $client->id = Str::orderedUuid();
    }

    public function retrieved(Client $client)
    {
        $client->incrementing = false;
    }
}
