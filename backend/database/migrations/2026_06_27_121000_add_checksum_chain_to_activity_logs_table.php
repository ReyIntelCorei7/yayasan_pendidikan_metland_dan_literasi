<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->string('previous_checksum', 64)->nullable()->after('user_agent');
            $table->string('checksum', 64)->nullable()->after('previous_checksum');

            $table->index('checksum');
        });
    }

    public function down(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropIndex(['checksum']);
            $table->dropColumn(['previous_checksum', 'checksum']);
        });
    }
};