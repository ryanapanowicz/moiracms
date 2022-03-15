<?php

namespace App\Models;

use App\Traits\HasAssets;
use App\Traits\HasUuid;
use Facades\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasUuid,
        HasFactory,
        HasAssets;

    /**
     * The attributes that are cast to different tpyes
     *
     * @var array
     */
    protected $casts = [
        'keywords' => 'array',
        'built_with' => 'array',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'slug',
        'content',
        'keywords',
        'description',
        'link',
        'built_with',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->slug = Str::slug($model->title);

            $slug =
                static::whereRaw("slug = '$model->slug' or slug LIKE '$model->slug-%'")
                ->latest('id')
                ->value('slug');

            if ($slug) {
                $pieces = explode('-', $slug);
                $number = intval(end($pieces));
                $model->slug .= '-' . ($number + 1);
            }
        });
    }

    /**
     * Get the User associated with the Project.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
