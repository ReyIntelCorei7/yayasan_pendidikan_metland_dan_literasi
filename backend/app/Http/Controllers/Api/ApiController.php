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

class ApiController extends Controller
{
    public function programs(): JsonResponse
    {
        $programs = Program::with('stats')
            ->orderBy('order')
            ->get()
            ->map(fn ($p) => [
                'id' => (string) $p->id,
                'title' => $p->title,
                'slug' => $p->slug,
                'category' => $p->category,
                'tagline' => $p->tagline,
                'description' => $p->description,
                'image' => $p->image ? asset('storage/' . $p->image) : $p->image,
                'stats' => $p->stats->map(fn ($s) => [
                    'label' => $s->label,
                    'value' => $s->value,
                ])->toArray(),
                'isFeatured' => $p->is_featured,
                'order' => $p->order,
            ]);

        return response()->json($programs);
    }

    public function programBySlug(string $slug): JsonResponse
    {
        $program = Program::with('stats')->where('slug', $slug)->firstOrFail();

        return response()->json([
            'id' => (string) $program->id,
            'title' => $program->title,
            'slug' => $program->slug,
            'category' => $program->category,
            'tagline' => $program->tagline,
            'description' => $program->description,
            'image' => $program->image ? asset('storage/' . $program->image) : $program->image,
            'stats' => $program->stats->map(fn ($s) => [
                'label' => $s->label,
                'value' => $s->value,
            ])->toArray(),
            'isFeatured' => $program->is_featured,
            'order' => $program->order,
        ]);
    }

    public function posts(): JsonResponse
    {
        $posts = Post::published()
            ->with('tags')
            ->orderByDesc('published_at')
            ->get()
            ->map(fn ($p) => $this->formatPost($p));

        return response()->json($posts);
    }

    public function postBySlug(string $slug): JsonResponse
    {
        $post = Post::with('tags')->where('slug', $slug)->firstOrFail();

        return response()->json($this->formatPost($post));
    }

    public function scholars(): JsonResponse
    {
        $scholars = Scholar::all()->map(fn ($s) => [
            'id' => (string) $s->id,
            'name' => $s->name,
            'country' => $s->country,
            'flag' => $s->flag,
            'quote' => $s->quote,
            'photo' => $s->photo ? asset('storage/' . $s->photo) : $s->photo,
            'program' => $s->program,
            'graduationYear' => $s->graduation_year,
            'isFeatured' => $s->is_featured,
        ]);

        return response()->json($scholars);
    }

    public function partners(): JsonResponse
    {
        $partners = Partner::where('is_active', true)->get()->map(fn ($p) => [
            'id' => (string) $p->id,
            'name' => $p->name,
            'logo' => $p->logo ? asset('storage/' . $p->logo) : $p->logo,
            'websiteUrl' => $p->website_url,
            'isActive' => $p->is_active,
        ]);

        return response()->json($partners);
    }

    public function impactStats(): JsonResponse
    {
        $stats = ImpactStat::all()->map(fn ($s) => [
            'id' => (string) $s->id,
            'value' => $s->value,
            'suffix' => $s->suffix,
            'label' => $s->label,
            'description' => $s->description,
            'icon' => $s->icon,
        ]);

        return response()->json($stats);
    }

    public function team(): JsonResponse
    {
        $team = TeamMember::orderBy('order')->get()->map(fn ($t) => [
            'id' => (string) $t->id,
            'name' => $t->name,
            'title' => $t->title,
            'department' => $t->department,
            'bio' => $t->bio,
            'photo' => $t->photo ? asset('storage/' . $t->photo) : $t->photo,
            'order' => $t->order,
            'social' => [
                'linkedin' => $t->linkedin,
                'twitter' => $t->twitter,
            ],
        ]);

        return response()->json($team);
    }

    public function books(): JsonResponse
    {
        $books = Book::published()
            ->orderBy('order')
            ->get()
            ->map(fn ($b) => [
                'id' => (string) $b->id,
                'title' => $b->title,
                'author' => $b->author,
                'description' => $b->description,
                'category' => $b->category,
                'coverImage' => $b->cover_image ? asset('storage/' . $b->cover_image) : null,
                'pdfUrl' => asset('storage/' . $b->pdf_file),
                'order' => $b->order,
            ]);

        return response()->json($books);
    }

    public function bookById(string $id): JsonResponse
    {
        $book = Book::published()->findOrFail($id);

        return response()->json([
            'id' => (string) $book->id,
            'title' => $book->title,
            'author' => $book->author,
            'description' => $book->description,
            'category' => $book->category,
            'coverImage' => $book->cover_image ? asset('storage/' . $book->cover_image) : null,
            'pdfUrl' => asset('storage/' . $book->pdf_file),
            'order' => $book->order,
        ]);
    }

    private function formatPost(Post $p): array
    {
        return [
            'id' => (string) $p->id,
            'title' => $p->title,
            'slug' => $p->slug,
            'excerpt' => $p->excerpt,
            'body' => $p->body,
            'featuredImage' => $p->featured_image ? asset('storage/' . $p->featured_image) : $p->featured_image,
            'category' => $p->category,
            'publishedAt' => $p->published_at?->format('Y-m-d'),
            'readingTime' => $p->reading_time,
            'author' => [
                'name' => $p->author_name,
                'photo' => $p->author_photo ? asset('storage/' . $p->author_photo) : $p->author_photo,
                'title' => $p->author_title,
            ],
            'tags' => $p->tags->pluck('tag')->toArray(),
        ];
    }
}
