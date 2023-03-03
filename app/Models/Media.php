<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\MediaCollections\Models\Media as BaseMedia;

class Media extends BaseMedia
{
    use HasFactory,
        HasUuid;

    public function getUrlAttribute()
    {
        return $this->getUrl();
    }

    public function getPreviewAttribute()
    {
        if ($this->hasGeneratedConversion('preview')) {
            return $this->getUrl('preview');
        }

        return '';
    }

    public function getAlternativeTextAttribute()
    {
        return $this->getCustomProperty('alternative_text');
    }

    public function getCaptionAttribute()
    {
        return $this->getCustomProperty('caption');
    }
}