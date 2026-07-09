<?php

namespace App\Support;

use Closure;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\Laravel\Facades\Image;
use Throwable;

class SafeImageUpload
{
    public static function toWebp(string $directory, int $quality = 82, ?int $maxWidth = null, ?int $maxHeight = null): Closure
    {
        $directory = self::normalizeDirectory($directory);

        return function ($file) use ($directory, $quality, $maxWidth, $maxHeight): string {
            try {
                $image = Image::decode(file_get_contents($file->getRealPath()));
                
                if ($maxWidth || $maxHeight) {
                    $image = $image->scaleDown($maxWidth, $maxHeight);
                }
                $encoded = $image->encode(new WebpEncoder($quality));
            } catch (Throwable) {
                throw ValidationException::withMessages([
                    'file' => 'File gambar tidak valid atau tidak dapat diproses.',
                ]);
            }

            $filename = $directory.'/'.Str::random(40).'.webp';
            $path = storage_path('app/public/'.$filename);

            if (! is_dir(dirname($path))) {
                mkdir(dirname($path), 0755, true);
            }

            file_put_contents($path, (string) $encoded, LOCK_EX);

            return $filename;
        };
    }

    private static function normalizeDirectory(string $directory): string
    {
        $directory = trim(str_replace('\\', '/', $directory), '/');

        if ($directory === '' || ! preg_match('/^[A-Za-z0-9_\/-]+$/', $directory)) {
            throw new \InvalidArgumentException('Invalid upload directory.');
        }

        return $directory;
    }
}