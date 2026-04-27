<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'body',
        'featured_image',
        'category',
        'published_at',
        'reading_time',
        'author_name',
        'author_photo',
        'author_title',
        'is_published',
    ];

    protected $casts = [
        'published_at' => 'date',
        'reading_time' => 'integer',
        'is_published' => 'boolean',
    ];

    public function tags(): HasMany
    {
        return $this->hasMany(PostTag::class);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
