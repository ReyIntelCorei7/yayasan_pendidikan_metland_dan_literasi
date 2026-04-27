<?php

use App\Http\Controllers\Api\ApiController;
use Illuminate\Support\Facades\Route;

// Public API - No authentication required
Route::prefix('v1')->group(function () {
    Route::get('/programs', [ApiController::class, 'programs']);
    Route::get('/programs/{slug}', [ApiController::class, 'programBySlug']);

    Route::get('/posts', [ApiController::class, 'posts']);
    Route::get('/posts/{slug}', [ApiController::class, 'postBySlug']);

    Route::get('/scholars', [ApiController::class, 'scholars']);
    Route::get('/partners', [ApiController::class, 'partners']);
    Route::get('/impact-stats', [ApiController::class, 'impactStats']);
    Route::get('/team', [ApiController::class, 'team']);

    Route::get('/books', [ApiController::class, 'books']);
    Route::get('/books/{id}', [ApiController::class, 'bookById']);
});
