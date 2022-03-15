<?php

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\Auth;
use Joselfonseca\LighthouseGraphQLPassport\Events\UserLoggedOut;
use Joselfonseca\LighthouseGraphQLPassport\Exceptions\AuthenticationException;

class Logout
{
    /**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        if (! Auth::guard('api')->check()) {
            throw new AuthenticationException('Not Authenticated', 'Not Authenticated');
        }

        $user = Auth::guard('api')->user();

        // revoke user's token
        $user->token()->revoke();

        // Revoke all of the token's refresh tokens
        app('Laravel\Passport\RefreshTokenRepository')
            ->revokeRefreshTokensByAccessTokenId(
                $user->token()->id
            );

        event(new UserLoggedOut($user));

        return [
            'status'  => 'TOKEN_REVOKED',
            'message' => __('Your session has been terminated'),
        ];
    }
}
