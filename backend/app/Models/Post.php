<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\HasAutoSlug;

class Post extends Model
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
        'is_important',
    ];

    protected $casts = [
        'is_published'  => 'boolean',
        'is_important'  => 'boolean',
        'published_at'  => 'date',
        'reading_time'  => 'integer',
        'title'         => 'array',
        'excerpt'       => 'array',
        'body'          => 'array',
    ];

    public function tags(): HasMany
    {
        return $this->hasMany(PostTag::class);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeImportant($query)
    {
        return $query->where('is_important', true);
    }

    /**
     * Ketika artikel ini di-set sebagai important,
     * otomatis matikan is_important pada artikel lain.
     */
    public function setAsImportant(): void
    {
        // Matikan semua artikel important lainnya (kecuali artikel ini)
        static::where('is_important', true)
            ->where('id', '!=', $this->id)
            ->update(['is_important' => false]);

        $this->update(['is_important' => true]);
    }
}
