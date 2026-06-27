<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class HeroStat extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'value',
        'suffix',
        'label',
        'description',
        'icon',
        'is_letter',
        'letter',
        'sort_order',
        'is_active',
    ];

    public $translatable = ['label', 'description'];

    protected $casts = [
        'is_letter' => 'boolean',
        'is_active' => 'boolean',
    ];
}
