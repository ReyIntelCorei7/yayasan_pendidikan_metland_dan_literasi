<?php

namespace App\Providers;

use App\Models\Book;
use App\Models\HeroStat;
use App\Models\ImpactStat;
use App\Models\OrgChartNode;
use App\Models\PageContent;
use App\Models\Partner;
use App\Models\Post;
use App\Models\Program;
use App\Models\ProgramStat;
use App\Models\Scholar;
use App\Models\TeamMember;
use App\Models\User;
use App\Support\AdminActivityLogger;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
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
        $this->configureRateLimiters();
        $this->registerAdminActivityLogging();

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

        // Experience / Impact Stats
        ImpactStat::saved(function () {
            Cache::forget('api.impact_stats');
            Cache::forget('api.experience_stats');
        });
        ImpactStat::deleted(function () {
            Cache::forget('api.impact_stats');
            Cache::forget('api.experience_stats');
        });

        // Collection Stats
        \App\Models\CollectionStat::saved(fn () => Cache::forget('api.collection_stats'));
        \App\Models\CollectionStat::deleted(fn () => Cache::forget('api.collection_stats'));

        // Team Members
        TeamMember::saved(fn () => Cache::forget('api.team'));
        TeamMember::deleted(fn () => Cache::forget('api.team'));

        // Banners
        \App\Models\Banner::saved(fn () => Cache::forget('api.banners'));
        \App\Models\Banner::deleted(fn () => Cache::forget('api.banners'));

        // Org Chart
        \App\Models\OrgChartNode::saved(fn () => Cache::forget('api.org_chart'));
        \App\Models\OrgChartNode::deleted(fn () => Cache::forget('api.org_chart'));

        // Page Contents
        \App\Models\PageContent::saved(function ($model) {
            Cache::forget("api.page_contents.{$model->page}");
        });
        \App\Models\PageContent::deleted(function ($model) {
            Cache::forget("api.page_contents.{$model->page}");
        });
    }

    private function configureRateLimiters(): void
    {
        RateLimiter::for('api-public', function (Request $request) {
            $limit = $request->is('api/v1/posts') || $request->is('api/v1/books') ? 120 : 180;

            return Limit::perMinute($limit)->by($request->ip());
        });

        RateLimiter::for('admin-panel', function (Request $request) {
            $limit = $request->is('admin/login') ? 10 : 120;

            return Limit::perMinute($limit)->by(optional($request->user())->id ?: $request->ip());
        });
    }

    private function registerAdminActivityLogging(): void
    {
        $models = [
            User::class,
            Post::class,
            Book::class,
            Program::class,
            ProgramStat::class,
            Scholar::class,
            Partner::class,
            TeamMember::class,
            ImpactStat::class,
            HeroStat::class,
            \App\Models\CollectionStat::class,
            \App\Models\Banner::class,
            OrgChartNode::class,
            PageContent::class,
        ];

        foreach ($models as $model) {
            $model::created(fn ($record) => AdminActivityLogger::created($record));
            $model::updated(fn ($record) => AdminActivityLogger::updated($record));
            $model::deleted(fn ($record) => AdminActivityLogger::deleted($record));
        }
    }
}
