<?php

use App\Models\Book;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return redirect('/admin');
});

Route::get('/downloads/books/{book}', function (Book $book) {
    abort_unless($book->is_published, 404);

    $disk = Storage::disk('local')->exists($book->pdf_file) ? 'local' : 'public';

    abort_unless(Storage::disk($disk)->exists($book->pdf_file), 404);

    if (request()->boolean('download')) {
        return Storage::disk($disk)->download(
            $book->pdf_file,
            basename($book->pdf_file),
            [
                'Content-Type' => 'application/pdf',
                'X-Content-Type-Options' => 'nosniff',
            ]
        );
    }

    return response()->file(
        Storage::disk($disk)->path($book->pdf_file),
        [
            'Content-Type' => 'application/pdf',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'public, max-age=86400',
        ]
    );
})->name('books.download');
