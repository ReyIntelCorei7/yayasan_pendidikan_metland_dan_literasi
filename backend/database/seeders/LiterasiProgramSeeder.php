<?php

namespace Database\Seeders;

use App\Models\LiterasiProgram;
use Illuminate\Database\Seeder;

class LiterasiProgramSeeder extends Seeder
{
    public function run(): void
    {
        $programs = [
            [
                'title'       => 'Pojok Baca',
                'description' => 'Program membaca buku gratis setiap hari Jumat untuk semua jenjang. Menyediakan akses bacaan berkualitas bagi seluruh siswa.',
                'order'       => 1,
                'is_active'   => true,
            ],
            [
                'title'       => 'Klub Literasi',
                'description' => 'Diskusi buku rutin bulanan dipandu mentor berpengalaman. Membangun komunitas pembaca yang aktif dan kritis.',
                'order'       => 2,
                'is_active'   => true,
            ],
            [
                'title'       => 'Lomba Menulis',
                'description' => 'Kompetisi karya tulis ilmiah dan fiksi tahunan antar sekolah. Mengasah kreativitas dan kemampuan berpikir.',
                'order'       => 3,
                'is_active'   => true,
            ],
            [
                'title'       => 'Bedah Buku',
                'description' => 'Acara interaktif mengupas isi dan makna buku pilihan. Memperdalam pemahaman literasi secara kolaboratif.',
                'order'       => 4,
                'is_active'   => true,
            ],
            [
                'title'       => 'Story Telling',
                'description' => 'Pengembangan kemampuan bercerita dan presentasi publik. Melatih percaya diri dan keterampilan komunikasi.',
                'order'       => 5,
                'is_active'   => true,
            ],
            [
                'title'       => 'Kunjungan Perpustakaan',
                'description' => 'Kunjungan edukatif ke perpustakaan nasional dan daerah. Menginspirasi semangat membaca sejak dini.',
                'order'       => 6,
                'is_active'   => true,
            ],
        ];

        foreach ($programs as $program) {
            LiterasiProgram::firstOrCreate(
                ['title' => $program['title']],
                $program
            );
        }
    }
}
