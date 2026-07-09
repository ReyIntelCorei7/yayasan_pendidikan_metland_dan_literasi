<?php

use App\Http\Controllers\Api\ApiController;
use Illuminate\Support\Facades\Route;

// Public API - No authentication required, but with named rate limiting.
Route::prefix('v1')->middleware('throttle:api-public')->group(function () {
    Route::get('/programs', [ApiController::class, 'programs']);
    Route::get('/programs/{slug}', [ApiController::class, 'programBySlug']);

    // Impact / Experience Stats
    Route::get('/impact-stats', [ApiController::class, 'impactStats']);
    Route::get('/collection-stats', [ApiController::class, 'collectionStats']);
    Route::get('/posts', [ApiController::class, 'posts']);
    Route::get('/posts/{slug}', [ApiController::class, 'postBySlug']);

    Route::get('/scholars', [ApiController::class, 'scholars']);
    Route::get('/partners', [ApiController::class, 'partners']);
    Route::get('/team', [ApiController::class, 'team']);
    Route::get('/impact-numbers', [ApiController::class, 'impactNumbers']);
    Route::get('/experience-stats', [ApiController::class, 'experienceStats']);
    Route::get('/schools', [ApiController::class, 'schools']);
    Route::get('/schools/{slug}', [ApiController::class, 'schoolBySlug']);

    Route::get('/books', [ApiController::class, 'books']);
    Route::get('/books/{id}', [ApiController::class, 'bookById']);

    Route::get('/banners', [ApiController::class, 'banners']);
    Route::get('/hero-stats', [\App\Http\Controllers\Api\HeroStatController::class, 'index']);

    Route::get('/org-chart', [ApiController::class, 'orgChart']);
    Route::get('/page-contents/{page}', [ApiController::class, 'pageContents']);
});
