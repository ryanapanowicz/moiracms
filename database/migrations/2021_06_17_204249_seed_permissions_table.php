<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SeedPermissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $tableNames = config('permission.table_names');

        if (empty($tableNames)) {
            throw new \Exception('Error: config/permission.php not loaded. Run [php artisan config:clear] and try again.');
        }

        $permissionsByRole = config('moiracms.permissions');

        $guard = config('auth.defaults.guard');

        DB::beginTransaction();

        $insertPermissions = fn ($role) => collect($permissionsByRole[$role])
            ->map(function ($name) use ($tableNames, $guard) {
                $insert = [
                    'id' => Str::orderedUuid()->toString(),
                    'name' => $name,
                    'guard_name' => $guard,
                    'created_at' => now(),
                    'updated_at' => now()
                ];

                $select = DB::table($tableNames['permissions'])->where(['name' => $name, 'guard_name' => $guard])->first();

                if (!$select) {
                    DB::table($tableNames['permissions'])->insert($insert);

                    return $insert;
                }

                return (array) $select;
            })
            ->toArray();

        $permissionIdsByRole = [];
        foreach ($permissionsByRole as $role => $permissions) {
            $permissionIdsByRole[$role] = $insertPermissions($role);
        }

        foreach ($permissionIdsByRole as $role => $permissionIds) {
            $roleId = Str::orderedUuid()->toString();

            DB::table($tableNames['roles'])
                ->insert([
                    'id' => $roleId,
                    'name' => $role,
                    'guard_name' => $guard,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

            DB::table($tableNames['role_has_permissions'])
                ->insert(
                    collect($permissionIds)->map(fn ($permission) => [
                        'role_id' => $roleId,
                        'permission_id' => $permission['id']
                    ])->toArray()
                );
        }

        DB::commit();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $tableNames = config('permission.table_names');

        if (empty($tableNames)) {
            throw new \Exception('Error: config/permission.php not found and defaults could not be merged. Please publish the package configuration before proceeding, or drop the tables manually.');
        }

        DB::table($tableNames['role_has_permissions'])->truncate();
        DB::table($tableNames['roles'])->truncate();
        DB::table($tableNames['permissions'])->truncate();
    }
}
