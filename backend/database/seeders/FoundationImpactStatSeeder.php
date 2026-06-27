<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\ImpactStat;

class FoundationImpactStatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('impact_stats')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $stats = [
            [
                'value' => 5000,
                'suffix' => '+',
                'label' => [
                    'id' => 'E-Book Tersedia',
                    'en' => 'E-Books Available'
                ],
                'description' => [
                    'id' => 'Akses ke ribuan e-book gratis untuk siswa dan guru.',
                    'en' => 'Access to thousands of free e-books for students and teachers.'
                ],
                'icon' => 'book',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'value' => 1200,
                'suffix' => '+',
                'label' => [
                    'id' => 'Buku Fisik',
                    'en' => 'Physical Books'
                ],
                'description' => [
                    'id' => 'Koleksi buku fisik berkualitas di setiap perpustakaan sekolah.',
                    'en' => 'High-quality physical book collections in every school library.'
                ],
                'icon' => 'book-open',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'value' => 12,
                'suffix' => '',
                'label' => [
                    'id' => 'Ruang Baca',
                    'en' => 'Reading Rooms'
                ],
                'description' => [
                    'id' => 'Ruang baca dan diskusi yang nyaman bagi siswa.',
                    'en' => 'Comfortable reading and discussion rooms for students.'
                ],
                'icon' => 'users',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'value' => 5,
                'suffix' => '',
                'label' => [
                    'id' => 'Unit Sekolah',
                    'en' => 'School Units'
                ],
                'description' => [
                    'id' => 'Program aktif di seluruh sekolah jaringan Metland.',
                    'en' => 'Active programs across all Metland school network units.'
                ],
                'icon' => 'home',
                'sort_order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($stats as $stat) {
            ImpactStat::create($stat);
        }
    }
}
