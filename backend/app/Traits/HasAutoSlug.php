<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasAutoSlug
{
    // Boot trait: auto-generate slug saat creating & updating
    public static function bootHasAutoSlug(): void
    {
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = static::generateUniqueSlug($model->getSlugSource(), $model);
            }
        });

        static::updating(function ($model) {
            // Jika slug kosong, regenerate dari sumber
            if (empty($model->slug)) {
                $model->slug = static::generateUniqueSlug($model->getSlugSource(), $model);
            }
        });
    }

    // Override di model untuk menentukan sumber slug
    // Contoh: return $this->title['id'] ?? '';
    abstract public function getSlugSource(): string;

    // Generate slug unik dengan suffix angka jika duplikat
    public static function generateUniqueSlug(string $source, $model = null): string
    {
        $slug = Str::slug($source);
        if (empty($slug)) $slug = 'untitled';

        $original = $slug;
        $count = 1;
        $query = static::where('slug', $slug);
        
        if ($model && $model->exists) {
            $query->where('id', '!=', $model->id);
        }

        while ($query->exists()) {
            $slug = $original . '-' . $count++;
            $query = static::where('slug', $slug);
            if ($model && $model->exists) {
                $query->where('id', '!=', $model->id);
            }
        }

        return $slug;
    }
}
