<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\Post;
use App\Models\User;
use App\Policies\PostPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertRedirect('/admin');
    }

    public function test_unpublished_post_slug_is_not_publicly_readable(): void
    {
        Post::create([
            'title' => ['id' => 'Draft Rahasia', 'en' => 'Secret Draft'],
            'slug' => 'draft-rahasia',
            'excerpt' => ['id' => 'Belum publik', 'en' => 'Not public'],
            'body' => ['id' => '<p>Konten draft</p>', 'en' => '<p>Draft content</p>'],
            'category' => 'Berita',
            'author_name' => 'Admin',
            'is_published' => false,
        ]);

        $this->getJson('/api/v1/posts/draft-rahasia')->assertNotFound();
    }

    public function test_api_responses_include_security_headers(): void
    {
        $this->getJson('/api/v1/posts')
            ->assertOk()
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('X-Frame-Options', 'SAMEORIGIN')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
            ->assertHeader('Permissions-Policy');
    }

    public function test_api_rejects_overlong_search_input(): void
    {
        $this->getJson('/api/v1/posts?search='.str_repeat('a', 81))
            ->assertUnprocessable();
    }

    public function test_admin_konten_cannot_delete_posts(): void
    {
        $user = User::create([
            'name' => 'Editor',
            'email' => 'editor@example.test',
            'password' => 'Password123!',
            'role' => 'admin_konten',
        ]);

        $post = Post::create([
            'title' => ['id' => 'Judul', 'en' => 'Title'],
            'slug' => 'judul',
            'excerpt' => ['id' => 'Ringkas', 'en' => 'Summary'],
            'body' => ['id' => '<p>Isi</p>', 'en' => '<p>Body</p>'],
            'category' => 'Berita',
            'author_name' => 'Admin',
            'is_published' => true,
        ]);

        $this->assertTrue((new PostPolicy())->update($user, $post));
        $this->assertFalse((new PostPolicy())->delete($user, $post));
    }

    public function test_super_admin_can_open_activity_logs_page(): void
    {
        $user = User::create([
            'name' => 'Super Admin',
            'email' => 'super@example.test',
            'password' => 'Password123!',
            'role' => 'super_admin',
        ]);

        $this->actingAs($user)
            ->get('/admin/activity-logs')
            ->assertOk();
    }
    public function test_admin_activity_log_has_tamper_evident_checksum(): void
    {
        $user = User::create([
            'name' => 'Super Admin',
            'email' => 'audit@example.test',
            'password' => 'Password123!',
            'role' => 'super_admin',
        ]);

        $this->actingAs($user);

        $post = Post::create([
            'title' => ['id' => 'Audit Trail', 'en' => 'Audit Trail'],
            'slug' => 'audit-trail',
            'excerpt' => ['id' => 'Ringkas', 'en' => 'Summary'],
            'body' => ['id' => '<p>Isi</p>', 'en' => '<p>Body</p>'],
            'category' => 'Berita',
            'author_name' => 'Admin',
            'is_published' => true,
        ]);

        $log = ActivityLog::query()->latest('id')->first();

        $this->assertNotNull($log);
        $this->assertSame($user->id, $log->user_id);
        $this->assertSame(Post::class, $log->model_type);
        $this->assertSame($post->id, $log->model_id);
        $this->assertSame('created', $log->event);
        $this->assertMatchesRegularExpression('/^[a-f0-9]{64}$/', $log->checksum);
    }

    public function test_super_admin_can_delete_post_and_activity_is_logged(): void
    {
        $user = User::create([
            'name' => 'Super Admin',
            'email' => 'delete-audit@example.test',
            'password' => 'Password123!',
            'role' => 'super_admin',
        ]);

        $post = Post::create([
            'title' => ['id' => 'Delete Me', 'en' => 'Delete Me'],
            'slug' => 'delete-me',
            'excerpt' => ['id' => 'Ringkas', 'en' => 'Summary'],
            'body' => ['id' => '<p>Isi</p>', 'en' => '<p>Body</p>'],
            'category' => 'Berita',
            'author_name' => 'Admin',
            'is_published' => true,
        ]);

        $this->actingAs($user);

        $post->delete();

        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $user->id,
            'event' => 'deleted',
            'model_type' => Post::class,
            'model_id' => $post->id,
        ]);
    }
}
