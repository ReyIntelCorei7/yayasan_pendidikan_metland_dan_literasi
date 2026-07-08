<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\HasAutoSlug;

class Program extends Model
{
    use HasFactory, HasAutoSlug;

    public function getSlugSource(): string
    {
        $title = $this->title;
        return $title['id'] ?? $title['en'] ?? '';
    }

    protected $fillable = [
        'title',
        'slug',
        'category',
        'tagline',
        'description',
        'image',
        'is_featured',
        'order',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'order' => 'integer',
        'title' => 'array',
        'tagline' => 'array',
        'description' => 'array',
    ];

    public function stats(): HasMany
    {
        return $this->hasMany(ProgramStat::class);
    }
}
