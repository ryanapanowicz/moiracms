<?php

namespace App\Models;

use App\Traits\HasUuid;
use App\Traits\HasAssets;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\HasMedia;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Joselfonseca\LighthouseGraphQLPassport\HasSocialLogin;
use Joselfonseca\LighthouseGraphQLPassport\HasLoggedInTokens;

class User extends Authenticatable implements HasMedia
{
    use HasUuid,
        HasApiTokens,
        HasFactory,
        Notifiable,
        HasLoggedInTokens,
        InteractsWithMedia,
        HasSocialLogin,
        HasRoles,
        HasAssets;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [];

    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('preview')
            ->fit(Manipulations::FIT_CROP, 640, 480)
            ->sharpen(10);
    }

    public function shouldDeletePreservingMedia(): bool
    {
        return true;
    }
}