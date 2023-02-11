<?php

namespace App\GraphQL\Mutations;

use Exception;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UpdateUser
{
    /**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        $user = User::findOrFail($args["id"]);

        $input = collect($args)
            ->except("password_confirmation")
            ->toArray();

        // Hash password if updating password
        if (array_key_exists("password", $input)) {
            $input["password"] = Hash::make($input["password"]);
        }

        try {
            DB::beginTransaction();

            if (array_key_exists("roles", $input)) {
                $roles = array_map('strtolower', $input["roles"]);
                $user->syncRoles($roles);
            }
            
            $update = $user->update($input);

            DB::commit();

            if ($update) {
                return ["user" => $user];
            }

        } catch (Exception $e) {
            DB::rollBack();
            return $e;
        }
    }
}
