<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use App\Traits\HasAutoSlug;

class School extends Model
{
    use HasFactory, HasTranslations, HasAutoSlug;

    public function getSlugSource(): string
    {
        // $this->name could be an array or string depending on HasTranslations behavior
        $name = $this->getTranslations('name');
        return $name['id'] ?? $name['en'] ?? (is_string($this->name) ? $this->name : '');
    }

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
