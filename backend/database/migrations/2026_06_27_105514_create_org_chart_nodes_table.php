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
        Schema::create('org_chart_nodes', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('subtitle')->nullable();
            $table->integer('level')->default(1);
            $table->integer('order')->default(0);
            $table->foreignId('parent_id')->nullable()->constrained('org_chart_nodes')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('org_chart_nodes');
    }
};
