<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->index('category');
            $table->index('published_at');
            $table->index('is_important');
        });

        Schema::table('books', function (Blueprint $table) {
            $table->index('category');
            $table->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropIndex(['category']);
            $table->dropIndex(['published_at']);
            $table->dropIndex(['is_important']);
        });

        Schema::table('books', function (Blueprint $table) {
            $table->dropIndex(['category']);
            $table->dropIndex(['order']);
        });
    }
};
