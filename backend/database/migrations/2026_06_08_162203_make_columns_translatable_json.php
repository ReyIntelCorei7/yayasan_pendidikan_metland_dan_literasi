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
        $tables = [
            'posts' => ['title', 'excerpt', 'body'],
            'programs' => ['title', 'tagline', 'description'],
            'banners' => ['title'],
            'scholars' => ['quote', 'program'],
        ];

        foreach ($tables as $table => $columns) {
            $rows = \Illuminate\Support\Facades\DB::table($table)->get();

            foreach ($columns as $column) {
                // Add a temporary JSON column
                Schema::table($table, function (Blueprint $t) use ($column) {
                    $t->json("{$column}_json")->nullable();
                });

                // Migrate data to JSON column
                foreach ($rows as $row) {
                    $val = $row->$column;
                    $jsonVal = $val ? json_encode(['id' => $val, 'en' => '']) : null;
                    \Illuminate\Support\Facades\DB::table($table)
                        ->where('id', $row->id)
                        ->update(["{$column}_json" => $jsonVal]);
                }

                // Drop the old column and rename the new one
                Schema::table($table, function (Blueprint $t) use ($column) {
                    $t->dropColumn($column);
                });
                Schema::table($table, function (Blueprint $t) use ($column) {
                    $t->renameColumn("{$column}_json", $column);
                });
            }
        }
    }

    public function down(): void
    {
        // Reverting would involve extracting 'id' from JSON back to text. 
        // For simplicity, we can just change type back if using DB::statement, but with Schema we would do the reverse.
    }
};
