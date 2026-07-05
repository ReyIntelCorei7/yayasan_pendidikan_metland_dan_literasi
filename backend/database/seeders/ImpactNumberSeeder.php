<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ImpactNumberSeeder extends Seeder
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
                'heading' => ['id' => 'Mengabdi untuk Pendidikan Indonesia', 'en' => 'Serving Education in Indonesia'],
                'description' => ['id' => 'Sejak didirikan, Yayasan Pendidikan Metland terus berkomitmen memberikan layanan pendidikan terbaik dengan mengedepankan pembentukan karakter dan kompetensi akademik siswa.', 'en' => 'Since its founding, Metland Education Foundation has been committed to providing the best education services by prioritizing character building and students\' academic competence.'],
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'value' => 3000,
                'suffix' => '+',
                'label' => ['id' => 'Siswa Terdidik', 'en' => 'Students Educated'],
                'heading' => ['id' => 'Membangun Generasi Unggul', 'en' => 'Building a Superior Generation'],
                'description' => ['id' => 'Kami telah mendidik ribuan siswa dari jenjang Taman Kanak-Kanak hingga Perguruan Tinggi, membekali mereka dengan keterampilan yang relevan dengan kebutuhan industri masa depan.', 'en' => 'We have educated thousands of students from Kindergarten to Higher Education, equipping them with relevant skills for the future industry needs.'],
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'value' => 150,
                'suffix' => '+',
                'label' => ['id' => 'Penghargaan', 'en' => 'Awards'],
                'heading' => ['id' => 'Prestasi dan Pengakuan', 'en' => 'Achievements and Recognition'],
                'description' => ['id' => 'Dedikasi kami dalam dunia pendidikan telah diakui melalui berbagai penghargaan tingkat regional maupun nasional, membuktikan kualitas pendidikan yang konsisten.', 'en' => 'Our dedication in the world of education has been recognized through various regional and national awards, proving consistent educational quality.'],
                'sort_order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($stats as $stat) {
            \App\Models\ImpactNumber::create($stat);
        }
    }
}
