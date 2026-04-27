<?php

namespace Database\Seeders;

use App\Models\ImpactStat;
use App\Models\Partner;
use App\Models\Post;
use App\Models\PostTag;
use App\Models\Program;
use App\Models\ProgramStat;
use App\Models\Scholar;
use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Programs
        $programs = [
            ['title' => 'Higher Life Learning', 'slug' => 'higher-life-learning', 'category' => 'education', 'tagline' => 'Empowering through quality education', 'description' => 'Providing access to world-class education for underprivileged youth across Africa. Our scholarship programs cover tuition, accommodation, and mentorship from primary school through university.', 'image' => 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80', 'is_featured' => true, 'order' => 1, 'stats' => [['label' => 'Students Enrolled', 'value' => '15,000+'], ['label' => 'Schools Supported', 'value' => '120'], ['label' => 'Countries', 'value' => '6']]],
            ['title' => 'Community Health Initiative', 'slug' => 'community-health-initiative', 'category' => 'health', 'tagline' => 'Building healthier communities', 'description' => 'Delivering essential healthcare services and education to underserved communities. From mobile clinics to health worker training, we are building sustainable healthcare infrastructure.', 'image' => 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80', 'is_featured' => true, 'order' => 2, 'stats' => [['label' => 'People Treated', 'value' => '250,000+'], ['label' => 'Health Workers', 'value' => '800'], ['label' => 'Clinics Built', 'value' => '45']]],
            ['title' => 'Sustainable Livelihoods', 'slug' => 'sustainable-livelihoods', 'category' => 'livelihoods', 'tagline' => 'Creating pathways to prosperity', 'description' => 'Equipping individuals and families with skills, resources, and opportunities to build sustainable livelihoods.', 'image' => 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80', 'is_featured' => true, 'order' => 3, 'stats' => [['label' => 'Families Supported', 'value' => '30,000+'], ['label' => 'Businesses Launched', 'value' => '5,000'], ['label' => 'Farm Projects', 'value' => '200']]],
            ['title' => 'Digital Literacy Program', 'slug' => 'digital-literacy-program', 'category' => 'education', 'tagline' => 'Bridging the digital divide', 'description' => 'Providing access to technology and digital skills training for students and young professionals.', 'image' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80', 'is_featured' => false, 'order' => 4, 'stats' => [['label' => 'Students Trained', 'value' => '8,000+'], ['label' => 'Computer Labs', 'value' => '60'], ['label' => 'Courses Offered', 'value' => '25']]],
            ['title' => 'Maternal & Child Health', 'slug' => 'maternal-child-health', 'category' => 'health', 'tagline' => 'Protecting mothers and children', 'description' => 'Comprehensive maternal and child health programs providing prenatal care, nutrition support, and immunization drives.', 'image' => 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=800&q=80', 'is_featured' => false, 'order' => 5, 'stats' => [['label' => 'Mothers Supported', 'value' => '45,000+'], ['label' => 'Children Vaccinated', 'value' => '120,000'], ['label' => 'Midwives Trained', 'value' => '350']]],
            ['title' => 'Agricultural Innovation', 'slug' => 'agricultural-innovation', 'category' => 'livelihoods', 'tagline' => 'Feeding the future of Africa', 'description' => 'Introducing modern farming techniques and climate-smart agriculture to smallholder farmers.', 'image' => 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80', 'is_featured' => false, 'order' => 6, 'stats' => [['label' => 'Farmers Trained', 'value' => '12,000+'], ['label' => 'Hectares Cultivated', 'value' => '50,000'], ['label' => 'Yield Increase', 'value' => '60%']]],
            ['title' => 'Teacher Development Academy', 'slug' => 'teacher-development-academy', 'category' => 'education', 'tagline' => 'Empowering educators to empower students', 'description' => 'A comprehensive teacher training program that equips educators with modern pedagogical skills.', 'image' => 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80', 'is_featured' => false, 'order' => 7, 'stats' => [['label' => 'Teachers Trained', 'value' => '3,500+'], ['label' => 'Workshops Held', 'value' => '400'], ['label' => 'Schools Reached', 'value' => '180']]],
            ['title' => 'Clean Water & Sanitation', 'slug' => 'clean-water-sanitation', 'category' => 'health', 'tagline' => 'Every drop counts', 'description' => 'Building water infrastructure and promoting hygiene education in communities lacking access to clean water.', 'image' => 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&q=80', 'is_featured' => false, 'order' => 8, 'stats' => [['label' => 'Wells Built', 'value' => '500+'], ['label' => 'People Served', 'value' => '200,000'], ['label' => 'Communities', 'value' => '150']]],
            ['title' => 'Youth Entrepreneurship Hub', 'slug' => 'youth-entrepreneurship-hub', 'category' => 'livelihoods', 'tagline' => 'Inspiring the next generation of leaders', 'description' => 'Providing young Africans with business mentorship, seed funding, and incubation support.', 'image' => 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80', 'is_featured' => false, 'order' => 9, 'stats' => [['label' => 'Entrepreneurs', 'value' => '2,000+'], ['label' => 'Startups Funded', 'value' => '350'], ['label' => 'Jobs Created', 'value' => '8,000']]],
        ];

        foreach ($programs as $data) {
            $stats = $data['stats'];
            unset($data['stats']);
            $program = Program::create($data);
            foreach ($stats as $stat) {
                ProgramStat::create(['program_id' => $program->id, 'label' => $stat['label'], 'value' => $stat['value']]);
            }
        }

        // Posts
        $posts = [
            ['title' => 'How Education Is Reshaping Rural Communities in Zimbabwe', 'slug' => 'education-reshaping-rural-communities-zimbabwe', 'excerpt' => 'A deep dive into how access to quality education is creating ripple effects across rural Zimbabwe.', 'body' => 'Education is more than just reading and writing. In the rural communities of Zimbabwe, it represents a fundamental shift in how families think about the future...', 'featured_image' => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80', 'category' => 'Education', 'published_at' => '2024-03-15', 'reading_time' => 8, 'author_name' => 'Sarah Johnson', 'author_photo' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', 'author_title' => 'Head of Communications', 'is_published' => true, 'tags' => ['education', 'zimbabwe', 'rural development']],
            ['title' => 'Annual Report 2024: A Year of Unprecedented Growth', 'slug' => 'annual-report-2024-unprecedented-growth', 'excerpt' => 'Our 2024 annual report highlights record-breaking impact numbers, new partnerships, and expanded programs.', 'body' => 'As we reflect on another year of impact, the numbers tell a story of transformation...', 'featured_image' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', 'category' => 'Reports', 'published_at' => '2024-03-01', 'reading_time' => 12, 'author_name' => 'Michael Chen', 'author_photo' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', 'author_title' => 'Director of Impact', 'is_published' => true, 'tags' => ['annual report', 'impact', 'growth']],
            ['title' => 'The Power of Clean Water: Stories From the Field', 'slug' => 'power-clean-water-stories-from-field', 'excerpt' => 'Meet the communities transformed by access to clean water and sanitation.', 'body' => 'Water is life. This simple truth drives our clean water initiative across Africa...', 'featured_image' => 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&q=80', 'category' => 'Health', 'published_at' => '2024-02-20', 'reading_time' => 6, 'author_name' => 'Grace Mwangi', 'author_photo' => 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80', 'author_title' => 'Field Coordinator', 'is_published' => true, 'tags' => ['health', 'clean water', 'community']],
            ['title' => 'Digital Skills: Preparing African Youth for the Future', 'slug' => 'digital-skills-preparing-african-youth-future', 'excerpt' => 'Our digital literacy program is equipping young Africans with the tech skills needed.', 'body' => 'The digital revolution is transforming economies worldwide, and Africa must not be left behind...', 'featured_image' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80', 'category' => 'Education', 'published_at' => '2024-01-25', 'reading_time' => 5, 'author_name' => 'Sarah Johnson', 'author_photo' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', 'author_title' => 'Head of Communications', 'is_published' => true, 'tags' => ['education', 'digital', 'technology']],
            ['title' => 'From Scholarship Recipient to Community Leader', 'slug' => 'scholarship-recipient-community-leader', 'excerpt' => 'The inspiring journey of Tendai Moyo, who went from a small village in Zimbabwe to becoming a leading advocate.', 'body' => 'Tendai\'s story begins in a small village in Masvingo province, where the nearest school was a 10km walk...', 'featured_image' => 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80', 'category' => 'Stories', 'published_at' => '2024-01-15', 'reading_time' => 9, 'author_name' => 'Grace Mwangi', 'author_photo' => 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80', 'author_title' => 'Field Coordinator', 'is_published' => true, 'tags' => ['stories', 'scholarship', 'leadership']],
        ];

        foreach ($posts as $data) {
            $tags = $data['tags'];
            unset($data['tags']);
            $post = Post::create($data);
            foreach ($tags as $tag) {
                PostTag::create(['post_id' => $post->id, 'tag' => $tag]);
            }
        }

        // Scholars
        Scholar::insert([
            ['name' => 'Amara Okafor', 'country' => 'Nigeria', 'flag' => '🇳🇬', 'quote' => 'The scholarship didn\'t just fund my education — it opened doors I never knew existed. Today I\'m a software engineer building solutions for my community.', 'photo' => 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80', 'program' => 'Higher Life Learning', 'graduation_year' => 2022, 'is_featured' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Tendai Moyo', 'country' => 'Zimbabwe', 'flag' => '🇿🇼', 'quote' => 'From a small village in Masvingo to graduating with honors. This foundation believed in me when no one else did.', 'photo' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80', 'program' => 'Higher Life Learning', 'graduation_year' => 2021, 'is_featured' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Fatima Diallo', 'country' => 'Senegal', 'flag' => '🇸🇳', 'quote' => 'Access to quality education transformed my family\'s trajectory. I\'m now a physician serving the same community I grew up in.', 'photo' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80', 'program' => 'Community Health Initiative', 'graduation_year' => 2020, 'is_featured' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Naledi Khumalo', 'country' => 'South Africa', 'flag' => '🇿🇦', 'quote' => 'Growing up in Soweto, university felt like a dream. Higher Life made it my reality.', 'photo' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80', 'program' => 'Digital Literacy Program', 'graduation_year' => 2022, 'is_featured' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Aisha Mohammed', 'country' => 'Ghana', 'flag' => '🇬🇭', 'quote' => 'The entrepreneurship hub gave me more than capital — it gave me a network and the confidence to build something meaningful.', 'photo' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', 'program' => 'Youth Entrepreneurship Hub', 'graduation_year' => 2023, 'is_featured' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Grace Uwimana', 'country' => 'Rwanda', 'flag' => '🇷🇼', 'quote' => 'The maternal health program saved my life and my baby\'s. Now I volunteer to help other mothers in my community.', 'photo' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80', 'program' => 'Maternal & Child Health', 'graduation_year' => 2021, 'is_featured' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Partners
        Partner::insert([
            ['name' => 'United Nations', 'logo' => null, 'website_url' => 'https://un.org', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'World Bank', 'logo' => null, 'website_url' => 'https://worldbank.org', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'UNICEF', 'logo' => null, 'website_url' => 'https://unicef.org', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'African Union', 'logo' => null, 'website_url' => 'https://au.int', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Gates Foundation', 'logo' => null, 'website_url' => 'https://gatesfoundation.org', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'USAID', 'logo' => null, 'website_url' => 'https://usaid.gov', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Impact Stats
        ImpactStat::insert([
            ['value' => 45000, 'suffix' => '+', 'label' => 'Lives Transformed', 'description' => 'Students, families, and community members whose lives have been directly impacted through our programs.', 'icon' => 'Heart', 'created_at' => now(), 'updated_at' => now()],
            ['value' => 6, 'suffix' => '', 'label' => 'African Countries', 'description' => 'Operating across six African nations with dedicated teams and partnerships.', 'icon' => 'Globe', 'created_at' => now(), 'updated_at' => now()],
            ['value' => 20, 'suffix' => '+', 'label' => 'Years of Impact', 'description' => 'Over two decades of continuous commitment to empowering communities.', 'icon' => 'Calendar', 'created_at' => now(), 'updated_at' => now()],
            ['value' => 1000000, 'suffix' => '+', 'label' => 'Meals Provided', 'description' => 'Nutritious meals served to students and community members through our feeding programs.', 'icon' => 'Utensils', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Team Members
        TeamMember::insert([
            ['name' => 'Dr. Strive Masiyiwa', 'title' => 'Founder & Chairman', 'department' => 'Leadership', 'bio' => 'Visionary entrepreneur and philanthropist dedicated to transforming Africa through education and technology.', 'photo' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', 'order' => 1, 'linkedin' => '#', 'twitter' => '#', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Tsitsi Masiyiwa', 'title' => 'Co-Founder & Executive Chair', 'department' => 'Leadership', 'bio' => 'Passionate advocate for education and community development across Africa.', 'photo' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', 'order' => 2, 'linkedin' => '#', 'twitter' => null, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'James Okonkwo', 'title' => 'Chief Executive Officer', 'department' => 'Leadership', 'bio' => 'Experienced leader with 20+ years in international development and nonprofit management.', 'photo' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', 'order' => 3, 'linkedin' => '#', 'twitter' => '#', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Sarah Johnson', 'title' => 'Head of Communications', 'department' => 'Communications', 'bio' => 'Award-winning communicator specializing in nonprofit storytelling and brand strategy.', 'photo' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', 'order' => 4, 'linkedin' => '#', 'twitter' => '#', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Michael Chen', 'title' => 'Director of Impact', 'department' => 'Programs', 'bio' => 'Data-driven leader focused on measuring and maximizing program impact across communities.', 'photo' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', 'order' => 5, 'linkedin' => '#', 'twitter' => null, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Grace Mwangi', 'title' => 'Field Operations Director', 'department' => 'Programs', 'bio' => 'On-the-ground leader coordinating programs across six African countries.', 'photo' => 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80', 'order' => 6, 'linkedin' => '#', 'twitter' => '#', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
