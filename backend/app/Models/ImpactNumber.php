<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class ImpactNumber extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'value',
        'suffix',
        'label',
        'heading',
        'description',
        'sort_order',
        'is_active',
    ];

    public $translatable = [
        'label',
        'heading',
        'description',
    ];

    protected $casts = [
        'value' => 'integer',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
}
