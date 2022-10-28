<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Relations\MorphPivot;

class Attachment extends MorphPivot
{
    use HasUuid;
}
