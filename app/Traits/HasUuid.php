<?php

namespace App\Traits;

use Facades\Str;

trait HasUuid
{
    /**
     * Laravel model boot
     */
    public static function bootHasUuid()
    {
        static::creating(function ($model) {
            $model->keyType = 'string';
            $model->incrementing = false;

            $model->{$model->getKeyName()} = $model->{$model->getKeyName()} ?: (string) Str::orderedUuid();
        });
    }

    /**
     * Get the value indicating whether the IDs are incrementing
     *
     * @return bool
     */
    public function getIncrementing()
    {
        return false;
    }

    /**
     * Get the auto-incrementing key type
     *
     * @return string
     */
    public function getKeyType()
    {
        return 'string';
    }
}
