<?php

namespace App\Providers;

use App\Models\Book;
use App\Models\ImpactStat;
use App\Models\Partner;
use App\Models\Post;
use App\Models\Program;
use App\Models\Scholar;
use App\Models\TeamMember;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     * Auto-clears API cache whenever content is saved or deleted
     * so the frontend always gets fresh data without manual cache clearing.
     */
    public function boot(): void
    {
        // Posts
        Post::saved(function (Post $post) {
            Cache::put('api.posts.version', time());
            if ($post->slug) {
                Cache::forget("api.post.{$post->slug}");
            }
        });
        Post::deleted(function (Post $post) {
            Cache::put('api.posts.version', time());
            if ($post->slug) {
                Cache::forget("api.post.{$post->slug}");
            }
        });

        // Books
        Book::saved(function (Book $book) {
            Cache::put('api.books.version', time());
            Cache::forget("api.book.{$book->id}");
        });
        Book::deleted(function (Book $book) {
            Cache::put('api.books.version', time());
            Cache::forget("api.book.{$book->id}");
        });

        // Programs
        Program::saved(function (Program $program) {
            Cache::forget('api.programs');
            if ($program->slug) {
                Cache::forget("api.program.{$program->slug}");
            }
        });
        Program::deleted(function (Program $program) {
            Cache::forget('api.programs');
            if ($program->slug) {
                Cache::forget("api.program.{$program->slug}");
            }
        });

        // Scholars
        Scholar::saved(fn () => Cache::forget('api.scholars'));
        Scholar::deleted(fn () => Cache::forget('api.scholars'));

        // Partners
        Partner::saved(fn () => Cache::forget('api.partners'));
        Partner::deleted(fn () => Cache::forget('api.partners'));

        // Impact Stats
        ImpactStat::saved(fn () => Cache::forget('api.impact_stats'));
        ImpactStat::deleted(fn () => Cache::forget('api.impact_stats'));

        // Team Members
        TeamMember::saved(fn () => Cache::forget('api.team'));
        TeamMember::deleted(fn () => Cache::forget('api.team'));

        // Banners
        \App\Models\Banner::saved(fn () => Cache::forget('api.banners'));
        \App\Models\Banner::deleted(fn () => Cache::forget('api.banners'));
    }
}
