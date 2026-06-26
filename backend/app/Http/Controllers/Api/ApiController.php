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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ApiController extends Controller
{
    // Cache TTL in seconds (1 hour). Cache is automatically invalidated by AppServiceProvider when data changes.
    private const TTL = 3600;

    /**
     * Get translated value based on Accept-Language header.
     */
    private function trans(mixed $value): mixed
    {
        if (is_array($value)) {
            $lang = request()->header('Accept-Language', 'id');
            // If English is requested but empty, fallback to ID.
            if ($lang === 'en' && empty($value['en'])) {
                return $value['id'] ?? '';
            }
            return $value[$lang] ?? $value['id'] ?? '';
        }
        return $value;
    }

    /**
     * Return a JSON response with ETag + Cache-Control headers.
     * Browser will get 304 Not Modified (0 bytes) if data hasn't changed.
     */
    private function cachedJson(mixed $data, int $ttl = self::TTL): JsonResponse
    {
        $etag = '"' . md5(json_encode($data)) . '"';
        $request = request();

        if ($request->header('If-None-Match') === $etag) {
            return response()->json(null, 304)
                ->header('ETag', $etag)
                ->header('Cache-Control', "public, max-age=0, s-maxage={$ttl}, must-revalidate");
        }

        return response()->json($data)
            ->header('ETag', $etag)
            ->header('Cache-Control', "public, max-age=0, s-maxage={$ttl}, must-revalidate")
            ->header('Vary', 'Accept-Encoding');
    }

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

        return $this->cachedJson($data);
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

        return $this->cachedJson($data);
    }

    public function posts(Request $request): JsonResponse
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 15);
        $category = $request->input('category');
        $search = $request->input('search');

        $version = Cache::get('api.posts.version', 1);
        $cacheKey = "api.posts.v{$version}.page_{$page}.per_{$perPage}.cat_{$category}.search_{$search}";

        $data = Cache::remember($cacheKey, self::TTL, function () use ($perPage, $category, $search) {
            $query = Post::published()
                ->select(['id','title','slug','excerpt','featured_image','category','published_at','reading_time','author_name','author_photo','author_title','is_published', 'is_important'])
                ->with(['tags:id,post_id,tag'])
                ->orderByDesc('is_important')
                ->orderByDesc('published_at');

            if ($category && $category !== 'All') {
                $query->where('category', $category);
            }

            if ($search) {
                $query->where('title', 'like', "%{$search}%");
            }

            $paginator = $query->paginate($perPage);
            $paginator->getCollection()->transform(fn ($p) => $this->formatPost($p));
            return $paginator->toArray();
        });

        return $this->cachedJson($data);
    }

    public function postBySlug(string $slug): JsonResponse
    {
        $data = Cache::remember("api.post.{$slug}", self::TTL, function () use ($slug) {
            $post = Post::with(['tags:id,post_id,tag'])
                ->where('slug', $slug)
                ->firstOrFail();
            return $this->formatPost($post);
        });

        return $this->cachedJson($data);
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

        return $this->cachedJson($data);
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

        return $this->cachedJson($data);
    }

    public function experienceStats(): JsonResponse
    {
        $data = Cache::remember('api.experience_stats', self::TTL, function () {
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

        return $this->cachedJson($data);
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

        return $this->cachedJson($data);
    }

    public function books(Request $request): JsonResponse
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 12);
        $category = $request->input('category');
        $search = $request->input('search');

        $version = Cache::get('api.books.version', 1);
        $cacheKey = "api.books.v{$version}.page_{$page}.per_{$perPage}.cat_{$category}.search_{$search}";

        $data = Cache::remember($cacheKey, self::TTL, function () use ($perPage, $category, $search) {
            $query = Book::published()
                ->select(['id','title','author','description','category','cover_image','pdf_file','order'])
                ->orderBy('order');

            if ($category && $category !== 'Semua') {
                $query->where('category', $category);
            }

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('author', 'like', "%{$search}%");
                });
            }

            $paginator = $query->paginate($perPage);
            
            $paginator->getCollection()->transform(fn ($b) => [
                'id'          => (string) $b->id,
                'title'       => $b->title,
                'author'      => $b->author,
                'description' => $b->description,
                'category'    => $b->category,
                'coverImage'  => $b->cover_image ? asset('storage/' . $b->cover_image) : null,
                'pdfUrl'      => asset('storage/' . $b->pdf_file),
                'order'       => $b->order,
            ]);

            return $paginator->toArray();
        });

        return $this->cachedJson($data);
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

        return $this->cachedJson($data);
    }
    public function banners(): JsonResponse
    {
        $data = Cache::remember('api.banners', self::TTL, function () {
            return \App\Models\Banner::where('is_active', true)
                ->orderBy('order')
                ->get()
                ->map(fn ($b) => [
                    'id'    => (string) $b->id,
                    'title' => $b->title,
                    'image' => $this->storageUrl($b->image),
                    'order' => $b->order,
                ])->toArray();
        });

        return $this->cachedJson($data);
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
            'isImportant'   => (bool) $p->is_important,
        ];
    }
}
