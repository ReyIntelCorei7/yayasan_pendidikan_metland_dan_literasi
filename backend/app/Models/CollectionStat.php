<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class CollectionStat extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'value',
        'suffix',
        'title',
        'description',
        'sort_order',
        'is_active',
    ];

    public $translatable = ['title', 'description'];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
