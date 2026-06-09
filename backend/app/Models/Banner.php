<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Facades\Cache;

class Banner extends Model
{
    protected $fillable = ['title', 'image', 'order', 'is_active'];

    protected $casts = [
        'title' => 'array',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected static function booted()
    {
        static::saved(fn () => Cache::forget('api.banners'));
        static::deleted(fn () => Cache::forget('api.banners'));
    }
}
