<?php

namespace App\Models;

use App\Traits\HasUuid;

class Role extends \Spatie\Permission\Models\Role
{
    use HasUuid;
}
