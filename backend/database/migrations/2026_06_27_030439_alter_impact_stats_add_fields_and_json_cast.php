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
        DB::table('impact_stats')->truncate();

        Schema::table('impact_stats', function (Blueprint $table) {
            $table->json('label')->change();
            $table->json('description')->change();
            $table->integer('sort_order')->default(0)->after('icon');
            $table->boolean('is_active')->default(true)->after('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('impact_stats', function (Blueprint $table) {
            $table->string('label')->change();
            $table->text('description')->change();
            $table->dropColumn(['sort_order', 'is_active']);
        });
    }
};
