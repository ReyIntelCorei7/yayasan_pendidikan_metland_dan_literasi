<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Posts: sering di-query by is_published + published_at order
        Schema::table('posts', function (Blueprint $table) {
            $table->index('is_published',  'idx_posts_is_published');
            $table->index('published_at',  'idx_posts_published_at');
            $table->index(['is_published', 'published_at'], 'idx_posts_published_filter');
        });

        // Programs: sering di-query by order
        Schema::table('programs', function (Blueprint $table) {
            $table->index('order', 'idx_programs_order');
            $table->index('is_featured', 'idx_programs_is_featured');
        });

        // Books: sering di-query by is_published + order
        Schema::table('books', function (Blueprint $table) {
            $table->index('is_published', 'idx_books_is_published');
            $table->index(['is_published', 'order'], 'idx_books_published_order');
        });

        // Partners: sering di-query by is_active
        Schema::table('partners', function (Blueprint $table) {
            $table->index('is_active', 'idx_partners_is_active');
        });

        // Team: sering di-query by order
        Schema::table('team_members', function (Blueprint $table) {
            $table->index('order', 'idx_team_order');
        });

        // PostTags: sering di-join with posts
        Schema::table('post_tags', function (Blueprint $table) {
            $table->index('post_id', 'idx_post_tags_post_id');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropIndex('idx_posts_is_published');
            $table->dropIndex('idx_posts_published_at');
            $table->dropIndex('idx_posts_published_filter');
        });

        Schema::table('programs', function (Blueprint $table) {
            $table->dropIndex('idx_programs_order');
            $table->dropIndex('idx_programs_is_featured');
        });

        Schema::table('books', function (Blueprint $table) {
            $table->dropIndex('idx_books_is_published');
            $table->dropIndex('idx_books_published_order');
        });

        Schema::table('partners', function (Blueprint $table) {
            $table->dropIndex('idx_partners_is_active');
        });

        Schema::table('team_members', function (Blueprint $table) {
            $table->dropIndex('idx_team_order');
        });

        Schema::table('post_tags', function (Blueprint $table) {
            $table->dropIndex('idx_post_tags_post_id');
        });
    }
};
