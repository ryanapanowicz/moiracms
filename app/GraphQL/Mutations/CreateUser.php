<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Exception;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CreateUser
{
    /**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        $input = collect($args)
            ->except("password_confirmation")
            ->toArray();
        $input["password"] = Hash::make($input["password"]);

        try {
            DB::beginTransaction();

            $user = User::create($input);

            if (array_key_exists("roles", $input)) {
                $roles = array_map('strtolower', $input["roles"]);
                $user->syncRoles($roles);
            }

            DB::commit();

            if ($user instanceof MustVerifyEmail) {
                $user->sendEmailVerificationNotification();
            }

            event(new Registered($user));

            return ["user" => $user];
        } catch (Exception $e) {
            DB::rollBack();
            return $e;
        }
    }
}
