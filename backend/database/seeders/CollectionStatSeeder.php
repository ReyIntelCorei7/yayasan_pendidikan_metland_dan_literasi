<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CollectionStatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stats = [
            [
                'value' => 1200,
                'suffix' => '+',
                'title' => [
                    'id' => 'Buku Teks & Referensi',
                    'en' => 'Textbooks & References',
                ],
                'description' => [
                    'id' => 'Koleksi buku teks pelajaran dan referensi akademik untuk semua jenjang pendidikan.',
                    'en' => 'Collection of textbooks and academic references for all levels of education.',
                ],
                'sort_order' => 1,
            ],
            [
                'value' => 450,
                'suffix' => '+',
                'title' => [
                    'id' => 'Jurnal & Majalah',
                    'en' => 'Journals & Magazines',
                ],
                'description' => [
                    'id' => 'Jurnal ilmiah, majalah pendidikan, dan publikasi berkala nasional maupun internasional.',
                    'en' => 'Scientific journals, educational magazines, and national and international periodicals.',
                ],
                'sort_order' => 2,
            ],
            [
                'value' => 5000,
                'suffix' => '+',
                'title' => [
                    'id' => 'E-Library',
                    'en' => 'E-Library',
                ],
                'description' => [
                    'id' => 'Akses perpustakaan digital 24 jam dengan ribuan buku elektronik dan sumber daring.',
                    'en' => '24-hour digital library access with thousands of electronic books and online resources.',
                ],
                'sort_order' => 3,
            ],
            [
                'value' => 12,
                'suffix' => '',
                'title' => [
                    'id' => 'Ruang Belajar Bersama',
                    'en' => 'Shared Study Rooms',
                ],
                'description' => [
                    'id' => 'Fasilitas ruang diskusi dan belajar kelompok yang nyaman dan kondusif.',
                    'en' => 'Comfortable and conducive group study and discussion room facilities.',
                ],
                'sort_order' => 4,
            ],
        ];

        foreach ($stats as $stat) {
            \App\Models\CollectionStat::create($stat);
        }
    }
}
