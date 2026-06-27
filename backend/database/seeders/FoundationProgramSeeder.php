<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Program;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class FoundationProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hapus program lama
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('program_stats')->truncate();
        Program::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $programs = [
            [
                'title' => [
                    'id' => 'Pendidikan Vokasi & Pariwisata',
                    'en' => 'Vocational & Tourism Education'
                ],
                'slug' => Str::slug('Pendidikan Vokasi & Pariwisata'),
                'category' => 'education',
                'tagline' => [
                    'id' => 'Membangun Karir Berkelas Dunia',
                    'en' => 'Building World-Class Careers'
                ],
                'description' => [
                    'id' => 'Mempersiapkan generasi muda agar siap kerja dan bersaing di industri pariwisata, perhotelan, kuliner, dan teknologi digital melalui SMK Pariwisata Metland. Kami berfokus pada kurikulum berbasis industri dan praktik langsung.',
                    'en' => 'Preparing the younger generation to be job-ready and competitive in the tourism, hospitality, culinary, and digital technology industries through SMK Pariwisata Metland. We focus on industry-based curriculum and hands-on practice.'
                ],
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'title' => [
                    'id' => 'Pendidikan Dasar Berkarakter',
                    'en' => 'Character-based Basic Education'
                ],
                'slug' => Str::slug('Pendidikan Dasar Berkarakter'),
                'category' => 'education',
                'tagline' => [
                    'id' => 'Pondasi Karakter Sejak Dini',
                    'en' => 'Character Foundation from an Early Age'
                ],
                'description' => [
                    'id' => 'Membangun pondasi karakter unggul, kreativitas, dan pembelajaran menyenangkan sejak usia dini melalui sekolah TK dan SD Tunas Metropolitan. Lingkungan belajar yang suportif untuk mengembangkan potensi anak.',
                    'en' => 'Building a foundation of superior character, creativity, and joyful learning from an early age through TK and SD Tunas Metropolitan schools. A supportive learning environment to develop children\'s potential.'
                ],
                'is_featured' => true,
                'order' => 2,
            ],
            [
                'title' => [
                    'id' => 'Gerakan Literasi Anak Indonesia',
                    'en' => 'Indonesian Children\'s Literacy Movement'
                ],
                'slug' => Str::slug('Gerakan Literasi Anak Indonesia'),
                'category' => 'education',
                'tagline' => [
                    'id' => 'Membuka Jendela Dunia',
                    'en' => 'Opening the Window to the World'
                ],
                'description' => [
                    'id' => 'Meningkatkan minat baca, menyediakan akses kepada buku-buku bermutu, dan menumbuhkan budaya literasi demi mencetak generasi cerdas dan berwawasan luas. Kami percaya membaca adalah kunci kemajuan bangsa.',
                    'en' => 'Increasing reading interest, providing access to quality books, and fostering a culture of literacy to create an intelligent and broad-minded generation. We believe reading is the key to national progress.'
                ],
                'is_featured' => true,
                'order' => 3,
            ]
        ];

        foreach ($programs as $program) {
            Program::create($program);
        }
    }
}
