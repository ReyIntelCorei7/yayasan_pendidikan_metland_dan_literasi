<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class School extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'slug',
        'name',
        'tagline',
        'level',
        'description',
        'features',
        'stats',
        'image',
        'color',
        'website',
        'sort_order',
        'is_active',
    ];

    public $translatable = [
        'name',
        'tagline',
        'level',
        'description',
    ];

    protected $casts = [
        'features' => 'array',
        'stats' => 'array',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
}
