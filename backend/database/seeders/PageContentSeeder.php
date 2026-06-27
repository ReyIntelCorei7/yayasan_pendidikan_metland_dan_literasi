<?php

namespace Database\Seeders;

use App\Models\PageContent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class PageContentSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        PageContent::truncate();
        Schema::enableForeignKeyConstraints();

        $contents = [
            [
                'page' => 'struktur-organisasi',
                'section' => 'hero_title',
                'content' => [
                    'id' => 'Struktur Organisasi Yayasan',
                    'en' => 'Foundation Organization Structure',
                ]
            ],
            [
                'page' => 'struktur-organisasi',
                'section' => 'hero_subtitle',
                'content' => [
                    'id' => 'Bersama mewujudkan pendidikan berkualitas melalui tata kelola yang profesional, transparan, dan akuntabel.',
                    'en' => 'Together realizing quality education through professional, transparent, and accountable governance.',
                ]
            ],
            [
                'page' => 'struktur-organisasi',
                'section' => 'chart_title',
                'content' => [
                    'id' => 'Bagan Struktur Yayasan',
                    'en' => 'Foundation Structure Chart',
                ]
            ],
            [
                'page' => 'struktur-organisasi',
                'section' => 'team_title',
                'content' => [
                    'id' => 'Tim Pengurus',
                    'en' => 'Management Team',
                ]
            ],
        ];

        foreach ($contents as $data) {
            PageContent::create($data);
        }
    }
}
