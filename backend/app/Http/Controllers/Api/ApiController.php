<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\ImpactStat;
use App\Models\Partner;
use App\Models\Post;
use App\Models\Program;
use App\Models\Scholar;
use App\Models\TeamMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class ApiController extends Controller
{
    // Cache TTL in seconds (5 minutes)
    private const TTL = 300;

    public function programs(): JsonResponse
    {
        $data = Cache::remember('api.programs', self::TTL, function () {
            return Program::with(['stats:id,program_id,label,value'])
                ->select(['id','title','slug','category','tagline','description','image','is_featured','order'])
                ->orderBy('order')
                ->get()
                ->map(fn ($p) => [
                    'id'          => (string) $p->id,
                    'title'       => $p->title,
                    'slug'        => $p->slug,
                    'category'    => $p->category,
                    'tagline'     => $p->tagline,
                    'description' => $p->description,
                    'image'       => $this->storageUrl($p->image),
                    'stats'       => $p->stats->map(fn ($s) => [
                        'label' => $s->label,
                        'value' => $s->value,
                    ])->toArray(),
                    'isFeatured'  => $p->is_featured,
                    'order'       => $p->order,
                ])->toArray();
        });

        return response()->json($data);
    }

    public function programBySlug(string $slug): JsonResponse
    {
        $data = Cache::remember("api.program.{$slug}", self::TTL, function () use ($slug) {
            $program = Program::with(['stats:id,program_id,label,value'])
                ->select(['id','title','slug','category','tagline','description','image','is_featured','order'])
                ->where('slug', $slug)
                ->firstOrFail();

            return [
                'id'          => (string) $program->id,
                'title'       => $program->title,
                'slug'        => $program->slug,
                'category'    => $program->category,
                'tagline'     => $program->tagline,
                'description' => $program->description,
                'image'       => $this->storageUrl($program->image),
                'stats'       => $program->stats->map(fn ($s) => [
                    'label' => $s->label,
                    'value' => $s->value,
                ])->toArray(),
                'isFeatured'  => $program->is_featured,
                'order'       => $program->order,
            ];
        });

        return response()->json($data);
    }

    public function posts(): JsonResponse
    {
        $data = Cache::remember('api.posts', self::TTL, function () {
            return Post::published()
                ->select(['id','title','slug','excerpt','featured_image','category','published_at','reading_time','author_name','author_photo','author_title','is_published'])
                ->with(['tags:id,post_id,tag'])
                ->orderByDesc('published_at')
                ->get()
                ->map(fn ($p) => $this->formatPost($p))
                ->toArray();
        });

        return response()->json($data);
    }

    public function postBySlug(string $slug): JsonResponse
    {
        $data = Cache::remember("api.post.{$slug}", self::TTL, function () use ($slug) {
            $post = Post::with(['tags:id,post_id,tag'])
                ->where('slug', $slug)
                ->firstOrFail();
            return $this->formatPost($post);
        });

        return response()->json($data);
    }

    public function scholars(): JsonResponse
    {
        $data = Cache::remember('api.scholars', self::TTL, function () {
            return Scholar::select(['id','name','country','flag','quote','photo','program','graduation_year','is_featured'])
                ->get()
                ->map(fn ($s) => [
                    'id'             => (string) $s->id,
                    'name'           => $s->name,
                    'country'        => $s->country,
                    'flag'           => $s->flag,
                    'quote'          => $s->quote,
                    'photo'          => $this->storageUrl($s->photo),
                    'program'        => $s->program,
                    'graduationYear' => $s->graduation_year,
                    'isFeatured'     => $s->is_featured,
                ])->toArray();
        });

        return response()->json($data);
    }

    public function partners(): JsonResponse
    {
        $data = Cache::remember('api.partners', self::TTL, function () {
            return Partner::where('is_active', true)
                ->select(['id','name','logo','website_url','is_active'])
                ->get()
                ->map(fn ($p) => [
                    'id'         => (string) $p->id,
                    'name'       => $p->name,
                    'logo'       => $this->storageUrl($p->logo),
                    'websiteUrl' => $p->website_url,
                    'isActive'   => $p->is_active,
                ])->toArray();
        });

        return response()->json($data);
    }

    public function impactStats(): JsonResponse
    {
        $data = Cache::remember('api.impact_stats', self::TTL, function () {
            return ImpactStat::select(['id','value','suffix','label','description','icon'])
                ->get()
                ->map(fn ($s) => [
                    'id'          => (string) $s->id,
                    'value'       => $s->value,
                    'suffix'      => $s->suffix,
                    'label'       => $s->label,
                    'description' => $s->description,
                    'icon'        => $s->icon,
                ])->toArray();
        });

        return response()->json($data);
    }

    public function team(): JsonResponse
    {
        $data = Cache::remember('api.team', self::TTL, function () {
            return TeamMember::select(['id','name','title','department','bio','photo','order','linkedin','twitter'])
                ->orderBy('order')
                ->get()
                ->map(fn ($t) => [
                    'id'         => (string) $t->id,
                    'name'       => $t->name,
                    'title'      => $t->title,
                    'department' => $t->department,
                    'bio'        => $t->bio,
                    'photo'      => $this->storageUrl($t->photo),
                    'order'      => $t->order,
                    'social'     => [
                        'linkedin' => $t->linkedin,
                        'twitter'  => $t->twitter,
                    ],
                ])->toArray();
        });

        return response()->json($data);
    }

    public function books(): JsonResponse
    {
        $data = Cache::remember('api.books', self::TTL, function () {
            return Book::published()
                ->select(['id','title','author','description','category','cover_image','pdf_file','order'])
                ->orderBy('order')
                ->get()
                ->map(fn ($b) => [
                    'id'          => (string) $b->id,
                    'title'       => $b->title,
                    'author'      => $b->author,
                    'description' => $b->description,
                    'category'    => $b->category,
                    'coverImage'  => $b->cover_image ? asset('storage/' . $b->cover_image) : null,
                    'pdfUrl'      => asset('storage/' . $b->pdf_file),
                    'order'       => $b->order,
                ])->toArray();
        });

        return response()->json($data);
    }

    public function bookById(string $id): JsonResponse
    {
        $data = Cache::remember("api.book.{$id}", self::TTL, function () use ($id) {
            $book = Book::published()
                ->select(['id','title','author','description','category','cover_image','pdf_file','order'])
                ->findOrFail($id);

            return [
                'id'          => (string) $book->id,
                'title'       => $book->title,
                'author'      => $book->author,
                'description' => $book->description,
                'category'    => $book->category,
                'coverImage'  => $book->cover_image ? asset('storage/' . $book->cover_image) : null,
                'pdfUrl'      => asset('storage/' . $book->pdf_file),
                'order'       => $book->order,
            ];
        });

        return response()->json($data);
    }

    private function storageUrl(?string $path): ?string
    {
        if (!$path) return null;
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }
        return asset('storage/' . $path);
    }

    private function formatPost(Post $p): array
    {
        return [
            'id'            => (string) $p->id,
            'title'         => $p->title,
            'slug'          => $p->slug,
            'excerpt'       => $p->excerpt,
            'body'          => $p->body,
            'featuredImage' => $this->storageUrl($p->featured_image),
            'category'      => $p->category,
            'publishedAt'   => $p->published_at?->format('Y-m-d'),
            'readingTime'   => $p->reading_time,
            'author'        => [
                'name'  => $p->author_name,
                'photo' => $this->storageUrl($p->author_photo),
                'title' => $p->author_title,
            ],
            'tags' => $p->tags->pluck('tag')->toArray(),
        ];
    }
}
