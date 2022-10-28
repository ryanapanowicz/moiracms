<?php

namespace App\Traits;

use App\Models\Media;
use App\Models\Attachment;

trait HasAssets
{
    /**
     * Laravel model boot
     */
    protected static function bootHasAssets()
    {
        self::deleting(function ($model) {
            $model->assets()->detach();
        });
    }

    /**
     * Get all of the Attachments for Modal.
     */
    public function assets()
    {
        return $this->morphToMany(Media::class, 'attachments')->using(Attachment::class);
    }
}
