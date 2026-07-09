<?php

namespace Database\Seeders;

use App\Models\School;
use Illuminate\Database\Seeder;

class SchoolSeeder extends Seeder
{
    public function run(): void
    {
        $schools = [
            [
                'slug' => 'tk-tunas-metropolitan',
                'name' => ['id' => 'TK Tunas Metropolitan', 'en' => 'TK Tunas Metropolitan'],
                'tagline' => ['id' => 'Bermain dan Belajar Bersama', 'en' => 'Play and Learn Together'],
                'level' => ['id' => 'TK', 'en' => 'Kindergarten'],
                'description' => ['id' => 'TK Tunas Metropolitan adalah jenjang pendidikan anak usia dini yang berfokus pada pengembangan karakter, kreativitas, dan kecerdasan emosional. Dengan pendekatan bermain sambil belajar, kami memastikan setiap anak tumbuh dengan bahagia dan siap memasuki jenjang berikutnya.', 'en' => 'TK Tunas Metropolitan is an early childhood education level that focuses on character development, creativity, and emotional intelligence. With a play-based learning approach, we ensure every child grows happily and is ready to enter the next level.'],
                'features' => [
                    ['id' => 'Kurikulum Merdeka Belajar', 'en' => 'Independent Learning Curriculum'],
                    ['id' => 'Stimulasi Motorik Terpadu', 'en' => 'Integrated Motoric Stimulation'],
                    ['id' => 'Pendidikan Karakter', 'en' => 'Character Education'],
                    ['id' => 'Lingkungan Bermain Aman', 'en' => 'Safe Play Environment']
                ],
                'stats' => [
                    ['value' => '120+', 'label' => ['id' => 'Siswa Aktif', 'en' => 'Active Students']],
                    ['value' => '15', 'label' => ['id' => 'Tenaga Pengajar', 'en' => 'Teaching Staff']],
                    ['value' => '2005', 'label' => ['id' => 'Tahun Berdiri', 'en' => 'Year Established']]
                ],
                'image' => null, // to be uploaded via admin
                'color' => '#FDE68A',
                'website' => 'https://www.sekolahtunasmetropolitan.net/',
                'sort_order' => 1,
            ],
            [
                'slug' => 'sd-tunas-metropolitan',
                'name' => ['id' => 'SD Tunas Metropolitan', 'en' => 'SD Tunas Metropolitan'],
                'tagline' => ['id' => 'Membangun Generasi Cerdas dan Berkarakter', 'en' => 'Building Smart and Characterful Generation'],
                'level' => ['id' => 'SD', 'en' => 'Primary School'],
                'description' => ['id' => 'SD Tunas Metropolitan memberikan pendidikan dasar yang komprehensif dengan memadukan akademik, seni, olahraga, dan teknologi. Kami percaya setiap anak memiliki potensi unik yang perlu dikembangkan secara optimal.', 'en' => 'SD Tunas Metropolitan provides comprehensive basic education by combining academics, arts, sports, and technology. We believe every child has unique potential that needs to be optimally developed.'],
                'features' => [
                    ['id' => 'Kurikulum Nasional + Internasional', 'en' => 'National + International Curriculum'],
                    ['id' => 'Program Bilingual', 'en' => 'Bilingual Program'],
                    ['id' => 'Ekstra Kurikuler Beragam', 'en' => 'Diverse Extracurriculars'],
                    ['id' => 'Literasi Digital', 'en' => 'Digital Literacy']
                ],
                'stats' => [
                    ['value' => '480+', 'label' => ['id' => 'Siswa Aktif', 'en' => 'Active Students']],
                    ['value' => '42', 'label' => ['id' => 'Tenaga Pengajar', 'en' => 'Teaching Staff']],
                    ['value' => '2008', 'label' => ['id' => 'Tahun Berdiri', 'en' => 'Year Established']]
                ],
                'image' => null,
                'color' => '#BBF7D0',
                'website' => 'https://www.sekolahtunasmetropolitan.net/',
                'sort_order' => 2,
            ],
            [
                'slug' => 'smk-pariwisata-metland-school',
                'name' => ['id' => 'SMK Pariwisata Metland Cileungsi', 'en' => 'SMK Pariwisata Metland Cileungsi'],
                'tagline' => ['id' => 'Pusat Keunggulan Vokasi', 'en' => 'Center of Vocational Excellence'],
                'level' => ['id' => 'SMK', 'en' => 'Vocational High School'],
                'description' => ['id' => 'SMK Pariwisata Metland Cileungsi mempersiapkan siswa menjadi tenaga profesional di bidang pariwisata, perhotelan, dan kuliner. Dengan fasilitas praktik bertaraf industri dan kemitraan dengan hotel berbintang, lulusan kami siap bersaing di tingkat nasional dan internasional.', 'en' => 'SMK Pariwisata Metland Cileungsi prepares students to become professionals in tourism, hospitality, and culinary fields. With industry-standard practice facilities and partnerships with starred hotels, our graduates are ready to compete nationally and internationally.'],
                'features' => [
                    ['id' => 'Jurusan Perhotelan', 'en' => 'Hospitality Department'],
                    ['id' => 'Jurusan Kuliner', 'en' => 'Culinary Department'],
                    ['id' => 'Jurusan Akuntansi', 'en' => 'Accounting Department'],
                    ['id' => 'Jurusan DKV', 'en' => 'Visual Communication Design Department'],
                    ['id' => 'Jurusan PPLG', 'en' => 'Software Engineering Department']
                ],
                'stats' => [
                    ['value' => '650+', 'label' => ['id' => 'Siswa Aktif', 'en' => 'Active Students']],
                    ['value' => '55', 'label' => ['id' => 'Tenaga Pengajar', 'en' => 'Teaching Staff']],
                    ['value' => '2012', 'label' => ['id' => 'Tahun Berdiri', 'en' => 'Year Established']]
                ],
                'image' => null,
                'color' => '#BFDBFE',
                'website' => 'https://www.smkmetland.net/',
                'sort_order' => 3,
            ],
            [
                'slug' => 'smk-metland',
                'name' => ['id' => 'SMK Pariwisata Metland Cibitung', 'en' => 'SMK Pariwisata Metland Cibitung'],
                'tagline' => ['id' => 'Siap Kerja dan Berwirausaha', 'en' => 'Ready for Work and Entrepreneurship'],
                'level' => ['id' => 'SMK', 'en' => 'Vocational High School'],
                'description' => ['id' => 'Berlokasi strategis di kawasan Metland Cibitung, sekolah ini berfokus pada 3 program keahlian unggulan untuk mencetak generasi yang inovatif dan siap kerja.', 'en' => 'Strategically located in the Metland Cibitung area, this school focuses on 3 excellent expertise programs to produce an innovative and work-ready generation.'],
                'features' => [
                    ['id' => 'Kuliner', 'en' => 'Culinary'],
                    ['id' => 'Pengembangan Perangkat Lunak dan Gim (PPLG)', 'en' => 'Software and Game Development (PPLG)'],
                    ['id' => 'Desain Komunikasi Visual (DKV)', 'en' => 'Visual Communication Design (DKV)']
                ],
                'stats' => [
                    ['value' => '720+', 'label' => ['id' => 'Siswa Aktif', 'en' => 'Active Students']],
                    ['value' => '60', 'label' => ['id' => 'Tenaga Pengajar', 'en' => 'Teaching Staff']],
                    ['value' => '2015', 'label' => ['id' => 'Tahun Berdiri', 'en' => 'Year Established']]
                ],
                'image' => null,
                'color' => '#FED7AA',
                'website' => 'https://www.smkmetlandcibitung.net/',
                'sort_order' => 4,
            ],
            [
                'slug' => 'metland-college',
                'name' => ['id' => 'Metland College', 'en' => 'Metland College'],
                'tagline' => ['id' => 'Pendidikan Vokasi Masa Depan', 'en' => 'Future Vocational Education'],
                'level' => ['id' => 'Perguruan Tinggi', 'en' => 'Higher Education'],
                'description' => ['id' => 'Metland College adalah perguruan tinggi vokasional yang menawarkan program D3 dan D4 di bidang bisnis, teknologi, dan pariwisata. Dengan kurikulum yang dikembangkan bersama industri, lulusan Metland College memiliki kompetensi tinggi dan siap memasuki dunia kerja.', 'en' => 'Metland College is a vocational college offering D3 and D4 programs in business, technology, and tourism. With a curriculum developed together with the industry, Metland College graduates have high competence and are ready to enter the workforce.'],
                'features' => [
                    ['id' => 'Program D3 & D4', 'en' => 'D3 & D4 Programs'],
                    ['id' => 'Kerjasama Industri', 'en' => 'Industry Partnership'],
                    ['id' => 'Beasiswa Berprestasi', 'en' => 'Achievement Scholarship'],
                    ['id' => 'Career Development Center', 'en' => 'Career Development Center']
                ],
                'stats' => [
                    ['value' => '890+', 'label' => ['id' => 'Mahasiswa Aktif', 'en' => 'Active Students']],
                    ['value' => '75', 'label' => ['id' => 'Dosen & Staf', 'en' => 'Lecturers & Staff']],
                    ['value' => '2018', 'label' => ['id' => 'Tahun Berdiri', 'en' => 'Year Established']]
                ],
                'image' => null,
                'color' => '#E9D5FF',
                'website' => 'https://metlandcollege.com/',
                'sort_order' => 5,
            ]
        ];

        foreach ($schools as $school) {
            School::updateOrCreate(['slug' => $school['slug']], $school);
        }
    }
}
