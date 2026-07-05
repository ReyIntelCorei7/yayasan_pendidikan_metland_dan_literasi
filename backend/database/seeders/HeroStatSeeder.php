<?php

namespace Database\Seeders;

use App\Models\HeroStat;
use Illuminate\Database\Seeder;

class HeroStatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stats = [
            [
                'value' => 25,
                'suffix' => '+',
                'label' => ['id' => 'Tahun Pengalaman', 'en' => 'Years of Experience'],
                'description' => ['id' => 'Berkomitmen dalam dunia pendidikan sejak 1998.', 'en' => 'Committed to the world of education since 1998.'],
                'icon' => 'trophy',
                'is_letter' => false,
                'letter' => null,
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'value' => 3000,
                'suffix' => '+',
                'label' => ['id' => 'Siswa', 'en' => 'Students'],
                'description' => ['id' => 'Membina generasi berkarakter dan berprestasi.', 'en' => 'Fostering a generation of character and achievement.'],
                'icon' => 'graduation',
                'is_letter' => false,
                'letter' => null,
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'value' => 5,
                'suffix' => '',
                'label' => ['id' => 'Unit Pendidikan', 'en' => 'Education Units'],
                'description' => ['id' => 'Tersebar di berbagai wilayah dengan fasilitas terbaik.', 'en' => 'Spread across various regions with the best facilities.'],
                'icon' => 'school',
                'is_letter' => false,
                'letter' => null,
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'value' => 150,
                'suffix' => '+',
                'label' => ['id' => 'Prestasi', 'en' => 'Achievements'],
                'description' => ['id' => 'Mencapai prestasi gemilang dalam berbagai bidang.', 'en' => 'Achieving brilliant achievements in various fields.'],
                'icon' => 'award',
                'is_letter' => false, // Using regular value + suffix is actually fine, frontend supports suffix "+" for animated counter.
                'letter' => '150+',
                'sort_order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($stats as $stat) {
            HeroStat::create($stat);
        }
    }
}
