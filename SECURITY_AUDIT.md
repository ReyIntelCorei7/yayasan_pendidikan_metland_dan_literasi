# Security Audit Report

Target: Laravel 13/Filament backend and React/Vite frontend in `C:\laragon\www\Revisian_yayasan_literasi_metschoo-v2`

Date: 2026-06-27  
Method: static review of application source/config/routes/models/resources, dependency audit, and limited local runtime header checks against `http://127.0.0.1:8000`. Dependency/generated directories (`vendor`, `node_modules`, Filament published assets, Vite `dist`) were not hand-reviewed line by line, but package manifests/lockfiles and runtime outputs were checked.

## Executive Summary

| ID | Severity | Finding | Location | Status |
|---|---|---|---|---|
| F-01 | HIGH | Filament content policies allow every authenticated admin-panel user to create/update/delete posts and books | `backend/app/Policies/PostPolicy.php:24-46`, `backend/app/Policies/BookPolicy.php:24-46` | Fixed in working tree |
| F-02 | HIGH | Draft/unpublished posts are readable by slug through public API | `backend/app/Http/Controllers/Api/ApiController.php:147-153` | Fixed in working tree |
| F-03 | HIGH | Uploads are stored under public web-accessible storage with incomplete file hardening | `backend/app/Filament/Resources/*`, `backend/config/filesystems.php:41-45` | Fixed for new uploads in working tree |
| F-04 | MEDIUM | Missing HTTP security headers and PHP version disclosure | Runtime headers, `backend/bootstrap/app.php:14-20`, `backend/public/.htaccess:1-25` | Fixed in Laravel responses |
| F-05 | MEDIUM | Session cookies are not forced Secure and session lifetime is long | `backend/config/session.php:172`, `backend/.env:30-32`, `backend/.env:5` | Config default fixed |
| F-06 | MEDIUM | Production frontend can call hardcoded HTTP localhost APIs | `frontend/src/hooks/useOrgChart.ts:26`, `frontend/src/hooks/usePageContent.ts:11`, `frontend/src/hooks/useTeam.ts:25` | Fixed in working tree |
| F-07 | MEDIUM | Admin-created passwords have no minimum complexity validation | `backend/app/Filament/Resources/Users/Schemas/UserForm.php:29-33` | Fixed in working tree |
| F-08 | MEDIUM | CORS allows wildcard methods and headers | `backend/config/cors.php:4-11` | Fixed in working tree |
| F-09 | MEDIUM | Search inputs are not length-limited and are cached with raw query text | `backend/app/Http/Controllers/Api/ApiController.php:116-139`, `:243-267` | Fixed in working tree |
| F-10 | LOW | Backend npm dependency set has no lockfile, so audit/reproducibility fails | `backend/package.json`, missing `backend/package-lock.json` | Fixed in working tree |
| F-11 | INFO | Positive controls observed | Multiple | Observed |
| F-12 | INFO | Items requiring production infrastructure validation | Apache/TLS/MySQL/firewall | Not verified locally |

## Detailed Findings

Update after remediation: the working tree now contains fixes for F-01, F-02, F-04, F-06, F-07, F-08, F-09, and F-10. F-03 is fixed for new uploads by moving new book PDFs to private storage, adding a controlled download route, adding Apache upload-directory hardening, and re-encoding new public images to WebP through a shared safe upload helper. Existing public media files remain intentionally public and should be reviewed or regenerated separately if provenance is unknown. F-05 has safer production defaults, but production `.env` and web-server HTTPS settings still need deployment-time confirmation.

Second remediation pass: added database-backed admin activity logging, a read-only super-admin Filament Audit Log page, named API/admin rate limiters, extra feature tests for headers/validation/policies, `backend/.env.production.example`, and `docs/SECURITY_DEPLOYMENT.md` with Apache/PHP/MySQL hardening notes. Application-code score after these changes is approximately 8.7/10 locally; reaching 9+ still depends on validating TLS, Apache global config, PHP global config, firewall, and DB privileges on the real production server.
Third remediation pass from advanced audit prompt:
- Added `App\Support\SafeImageUpload` and wired post, author, book cover, program, partner, team, and banner image uploads through server-side decode/re-encode to WebP. This strips metadata and rejects malformed image payloads before they land in public storage.
- Added a tamper-evident checksum chain to `activity_logs` using HMAC-SHA256 over the logged event payload and previous log checksum.
- Added checksum visibility to the Filament Audit Log table.
- Restricted trusted proxy handling to explicit `TRUSTED_PROXIES` values so spoofed forwarding headers do not weaken IP-based rate limits or audit log IP attribution.
- Documented reverse-proxy deployment requirements in `docs/SECURITY_DEPLOYMENT.md` and `backend/.env.production.example`.

### F-01 HIGH - Filament policies allow broad content modification

Description: `PostPolicy` and `BookPolicy` return `true` for `create`, `update`, `delete`, `restore`, and `forceDelete`. Any account that can authenticate to Filament can modify or remove posts and books. `UserPolicy` also allows any authenticated panel user to list/view all users, including email and role metadata.

Locations:
- `backend/app/Policies/PostPolicy.php:24-46`
- `backend/app/Policies/BookPolicy.php:24-46`
- `backend/app/Policies/UserPolicy.php:13-20`
- `backend/app/Filament/Resources/Users/Tables/UsersTable.php:17-33`

PoC:
1. Log in to `/admin` as any non-super-admin Filament user.
2. Browse to `/admin/posts` or `/admin/books`.
3. Create, edit, delete, restore, or force-delete records because policy methods return `true`.
4. Browse `/admin/users` and observe user email/role listing because `viewAny` and `view` return `true`.

Impact: horizontal/vertical privilege escalation inside the admin panel, content tampering, destructive deletion, and exposure of account metadata.

Remediation:

```php
// backend/app/Policies/PostPolicy.php
public function viewAny(User $user): bool
{
    return $user->isSuperAdmin() || $user->isAdminKonten();
}

public function create(User $user): bool
{
    return $user->isSuperAdmin() || $user->isAdminKonten();
}

public function update(User $user, Post $post): bool
{
    return $user->isSuperAdmin() || $user->isAdminKonten();
}

public function delete(User $user, Post $post): bool
{
    return $user->isSuperAdmin();
}

public function forceDelete(User $user, Post $post): bool
{
    return $user->isSuperAdmin();
}
```

```php
// backend/app/Policies/UserPolicy.php
public function viewAny(User $user): bool
{
    return $user->isSuperAdmin();
}

public function view(User $user, User $model): bool
{
    return $user->isSuperAdmin() || $user->id === $model->id;
}
```

References:
- https://owasp.org/Top10/A01_2021-Broken_Access_Control/
- https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- https://cwe.mitre.org/data/definitions/862.html

### F-02 HIGH - Draft posts are publicly readable by slug

Description: `/api/v1/posts` correctly uses `Post::published()`, but `/api/v1/posts/{slug}` does not. A draft post can be fetched if the slug is known or guessed.

Location: `backend/app/Http/Controllers/Api/ApiController.php:147-153`

PoC:
1. In Filament, create a post with `is_published = false` and slug `secret-draft`.
2. Request `GET http://127.0.0.1:8000/api/v1/posts/secret-draft`.
3. The controller runs `Post::with(...)->where('slug', $slug)->firstOrFail()` and returns the formatted post without checking `is_published`.

Impact: embargoed announcements, draft content, author metadata, and rich-text body content can leak publicly.

Remediation:

```php
public function postBySlug(string $slug): JsonResponse
{
    $data = Cache::remember("api.post.{$slug}", self::TTL, function () use ($slug) {
        $post = Post::published()
            ->with(['tags:id,post_id,tag'])
            ->where('slug', $slug)
            ->firstOrFail();

        return $this->formatPost($post);
    });

    return $this->cachedJson($data);
}
```

Add a feature test:

```php
public function test_unpublished_post_slug_is_not_public(): void
{
    $post = Post::factory()->create([
        'slug' => 'secret-draft',
        'is_published' => false,
    ]);

    $this->getJson('/api/v1/posts/'.$post->slug)->assertNotFound();
}
```

References:
- https://owasp.org/Top10/A01_2021-Broken_Access_Control/
- https://cwe.mitre.org/data/definitions/200.html

### F-03 HIGH - Public upload storage with incomplete file hardening

Description: Upload fields use `->disk('public')`, mapping files into `storage/app/public` and then `public/storage`. Many image uploads use MIME allowlists and size limits, which is good, but storage remains web-accessible. `BookResource` publishes PDF files directly, and `BannerForm` re-encodes images but lacks explicit `acceptedFileTypes()` and `maxSize()`.

Locations:
- `backend/config/filesystems.php:41-45`
- `backend/config/filesystems.php:76-78`
- `backend/app/Filament/Resources/BookResource.php:61-77`
- `backend/app/Filament/Resources/PostResource.php:96-110`
- `backend/app/Filament/Resources/Partners/PartnerResource.php:47-53`
- `backend/app/Filament/Resources/TeamMembers/Schemas/TeamMemberForm.php:47-51`
- `backend/app/Filament/Resources/Banners/Schemas/BannerForm.php:29-49`

PoC:
1. Upload a PDF via `/admin/books`.
2. The API returns `pdfUrl` as `asset('storage/' . $b->pdf_file)` at `ApiController.php:276`.
3. Anyone can retrieve the uploaded file through `/storage/books/...` without authorization or download headers.

Impact: public hosting of malicious or copyrighted content, PDF active content/phishing risks, content sniffing issues, and no central authorization/audit point for downloads.

Remediation:

```php
// Store private by default for uploaded documents.
FileUpload::make('pdf_file')
    ->acceptedFileTypes(['application/pdf'])
    ->rules(['mimetypes:application/pdf', 'max:20480'])
    ->directory('books')
    ->disk('local')
    ->visibility('private')
    ->required();
```

```php
// routes/web.php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/downloads/books/{book}', function (\App\Models\Book $book) {
    abort_unless($book->is_published, 404);

    return Storage::disk('local')->download(
        $book->pdf_file,
        basename($book->pdf_file),
        [
            'Content-Type' => 'application/pdf',
            'X-Content-Type-Options' => 'nosniff',
            'Content-Disposition' => 'attachment',
        ]
    );
})->whereNumber('book');
```

```apache
# backend/public/.htaccess defense-in-depth for public storage
<FilesMatch "\.(php|phtml|phar|cgi|pl|asp|aspx|jsp)$">
    Require all denied
</FilesMatch>
Header always set X-Content-Type-Options "nosniff"
```

References:
- https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- https://cwe.mitre.org/data/definitions/434.html

### F-04 MEDIUM - Missing security headers and PHP version disclosure

Description: Local runtime responses for `/api/v1/posts` and `/admin` lacked `X-Frame-Options`, `X-Content-Type-Options`, `Content-Security-Policy`, `Referrer-Policy`, `Permissions-Policy`, and HSTS. Responses included `X-Powered-By: PHP/8.3.16`.

Evidence from local runtime:
- `GET http://127.0.0.1:8000/api/v1/posts` returned `X-Powered-By: PHP/8.3.16`
- `GET http://127.0.0.1:8000/admin` returned no clickjacking/CSP/nosniff headers

Locations:
- `backend/bootstrap/app.php:14-20`
- `backend/public/.htaccess:1-25`

PoC:
1. Run: `Invoke-WebRequest http://127.0.0.1:8000/api/v1/posts -UseBasicParsing`
2. Inspect headers and observe missing controls plus `X-Powered-By`.

Impact: higher exploitability for clickjacking/content sniffing/XSS chains and unnecessary technology fingerprinting.

Remediation:

```php
// app/Http/Middleware/SecurityHeaders.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        $response->headers->set('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; frame-src https://maps.google.com");

        if ($request->isSecure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        return $response;
    }
}
```

```php
// backend/bootstrap/app.php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->api(prepend: [
        \Illuminate\Http\Middleware\HandleCors::class,
    ]);
    $middleware->append(\App\Http\Middleware\SecurityHeaders::class);
})
```

Also set in PHP/Apache:

```ini
; php.ini
expose_php = Off
```

```apache
ServerTokens Prod
ServerSignature Off
Header unset X-Powered-By
```

References:
- https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
- https://owasp.org/Top10/A05_2021-Security_Misconfiguration/
- https://cwe.mitre.org/data/definitions/693.html

### F-05 MEDIUM - Session cookies are not forced Secure and session lifetime is long

Description: `SESSION_SECURE_COOKIE` is not set in `.env`; Laravel reads `env('SESSION_SECURE_COOKIE')`, which can leave cookies without the `Secure` attribute. Runtime `/admin` response showed session cookies with `HttpOnly` and `SameSite=Lax`, but no `Secure` because the app is running HTTP. Session lifetime is `480` minutes and session encryption is disabled.

Locations:
- `backend/config/session.php:172`
- `backend/config/session.php:185`
- `backend/config/session.php:202`
- `backend/.env:5`
- `backend/.env:30-32`

PoC:
1. Request `GET http://127.0.0.1:8000/admin`.
2. Observe `Set-Cookie` has `httponly; samesite=lax`, but no `secure`.

Impact: in non-HTTPS deployments, session cookies can traverse the network in plaintext. Long idle lifetime increases session hijack window.

Remediation:

```env
APP_ENV=production
APP_URL=https://example.org
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
SESSION_ENCRYPT=true
SESSION_LIFETIME=120
```

References:
- https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- https://cwe.mitre.org/data/definitions/614.html

### F-06 MEDIUM - Frontend has hardcoded HTTP localhost API URLs

Description: Several hooks bypass the centralized relative API client and call `http://localhost:8000` directly.

Locations:
- `frontend/src/hooks/useOrgChart.ts:26`
- `frontend/src/hooks/usePageContent.ts:11`
- `frontend/src/hooks/useTeam.ts:25`
- Central safer pattern exists in `frontend/src/services/api.ts:4-25`

PoC:
1. Build frontend for production.
2. Open the production site from a real domain.
3. Browser attempts to fetch the user's local machine at `http://localhost:8000`, or blocks mixed content under HTTPS.

Impact: broken production data loading, accidental HTTP downgrade, privacy leak to local services, and inconsistent CORS behavior.

Remediation:

```ts
// frontend/src/services/api.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';
```

```ts
// Example hook replacement
const response = await fetch(`${API_BASE}/org-chart`, {
  headers: { Accept: 'application/json' },
});
```

Use only relative `/api/v1` behind the same origin, or set `VITE_API_BASE_URL=https://api.example.org/api/v1`.

References:
- https://owasp.org/Top10/A05_2021-Security_Misconfiguration/
- https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html

### F-07 MEDIUM - Admin-created passwords have no complexity validation

Description: Filament `UserForm` hashes passwords correctly, but it does not enforce minimum length, confirmation, breach checks, or complexity. Any super admin can create weak passwords such as `12345678` if not controlled operationally.

Location: `backend/app/Filament/Resources/Users/Schemas/UserForm.php:29-33`

PoC:
1. Go to `/admin/users/create`.
2. Enter a short/weak password.
3. Form only requires presence on create and hashes whatever is supplied.

Impact: weak admin credentials increase credential stuffing/brute-force risk.

Remediation:

```php
use Illuminate\Validation\Rules\Password;

TextInput::make('password')
    ->password()
    ->revealable()
    ->rule(Password::min(12)->letters()->mixedCase()->numbers()->symbols()->uncompromised())
    ->dehydrateStateUsing(fn ($state) => \Illuminate\Support\Facades\Hash::make($state))
    ->dehydrated(fn ($state) => filled($state))
    ->required(fn (string $operation): bool => $operation === 'create');
```

References:
- https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- https://cwe.mitre.org/data/definitions/521.html

### F-08 MEDIUM - CORS allows wildcard methods and headers

Description: CORS origin is restricted to `FRONTEND_URL`, which is good. However, `allowed_methods` and `allowed_headers` are wildcards for all API/storage paths. This is broader than needed for a mostly public GET API.

Location: `backend/config/cors.php:4-11`

PoC:
1. Inspect `backend/config/cors.php`.
2. Observe `allowed_methods => ['*']` and `allowed_headers => ['*']`.

Impact: unnecessary cross-origin attack surface if future state-changing endpoints are added under `/api/*`.

Remediation:

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['GET', 'HEAD', 'OPTIONS'],
    'allowed_origins' => [env('FRONTEND_URL', 'https://example.org')],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['Accept', 'Content-Type', 'X-Requested-With', 'X-XSRF-TOKEN'],
    'exposed_headers' => ['ETag', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    'max_age' => 86400,
    'supports_credentials' => false,
];
```

References:
- https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
- https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

### F-09 MEDIUM - Search inputs are not length-limited and are cached with raw query text

Description: `posts()` and `books()` cast pagination safely and cap `per_page` at 100, but `search` and `category` are not validated for length/format. They are embedded directly into cache keys and used in leading-wildcard `LIKE` queries.

Locations:
- `backend/app/Http/Controllers/Api/ApiController.php:116-139`
- `backend/app/Http/Controllers/Api/ApiController.php:243-267`

PoC:
1. Send many requests such as `/api/v1/posts?search=<unique-long-string>`.
2. Each unique value creates a different cache key at `ApiController.php:122`.
3. The database query uses `%term%`, which can become expensive on large tables.

Impact: cache pollution and avoidable database load. SQL injection is not observed here because Eloquent parameter binding is used, but DoS risk remains.

Remediation:

```php
$validated = $request->validate([
    'page' => ['nullable', 'integer', 'min:1', 'max:10000'],
    'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
    'category' => ['nullable', 'string', 'max:50'],
    'search' => ['nullable', 'string', 'max:80'],
]);

$search = trim($validated['search'] ?? '');
$cacheKey = 'api.posts.v'.$version.'.'.hash('sha256', json_encode([
    'page' => $validated['page'] ?? 1,
    'per_page' => $validated['per_page'] ?? 15,
    'category' => $validated['category'] ?? null,
    'search' => $search,
]));
```

For larger data, consider full-text indexes and avoid caching every unique search.

References:
- https://owasp.org/Top10/A04_2021-Insecure_Design/
- https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html

### F-10 LOW - Backend npm package has no lockfile

Description: `backend/package.json` exists, but `backend/package-lock.json` does not. `npm audit --json` failed with `ENOLOCK`, so backend Vite/Tailwind tooling is not fully reproducible and cannot be audited via npm in this workspace.

Location:
- `backend/package.json`
- missing `backend/package-lock.json`

PoC:
1. Run `cd backend && npm audit --json`.
2. npm returns `ENOLOCK` and recommends creating a lockfile.

Impact: supply-chain drift between environments and missed vulnerability audit coverage for backend Node tooling.

Remediation:

```powershell
cd backend
npm install --package-lock-only
npm audit
git add package-lock.json
```

References:
- https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/
- https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html

### F-11 INFO - Positive controls observed

Observed:
- `backend/.env` is listed in `backend/.gitignore` and is not tracked by `git ls-files`.
- Runtime `GET http://127.0.0.1:8000/.env` returned `404` under the active Laravel server.
- `APP_DEBUG=false` in `backend/.env:4`.
- `User` password uses Laravel hashed cast at `backend/app/Models/User.php:25-30`.
- API list endpoints use Eloquent query builder; no user-controlled raw SQL was found.
- `posts()` and `books()` cap `per_page` at 100.
- React rich-text render paths use `DOMPurify.sanitize()` at `frontend/src/pages/ArtikelDetail.tsx:259` and `frontend/src/pages/NewsDetail.tsx:98`.
- React is wrapped in `React.StrictMode` at `frontend/src/main.tsx:22-25`.
- No frontend `localStorage` or `sessionStorage` token storage was found.
- `composer audit` found no advisories.
- `npm audit` for root and frontend found no advisories.
- Frontend production `dist` search found no source maps.

### F-12 INFO - Production infrastructure items not verified locally

Not verifiable from this local workspace alone:
- Public Apache vhost document root and whether it points only to `backend/public` and `frontend/dist`.
- Public TLS certificate, HTTP to HTTPS redirect, TLS versions/ciphers, and HSTS preload eligibility.
- MySQL network exposure, MySQL user grants, backup encryption, WAF/DDoS protection, and firewall ports.
- Apache global settings such as `ServerTokens Prod`, `ServerSignature Off`, timeout/slowloris controls, and disabled modules.
- PHP global settings such as `disable_functions`, `open_basedir`, `allow_url_fopen`, upload/body limits, and `expose_php` outside the runtime evidence above.

## Dependency Results

| Command | Result |
|---|---|
| `cd backend && composer audit --no-interaction` | No security vulnerability advisories found |
| `cd frontend && npm audit --json` | 0 vulnerabilities |
| `npm audit --json` at repo root | 0 vulnerabilities |
| `cd backend && npm audit --json` | 0 vulnerabilities after adding `backend/package-lock.json` |
| `cd backend && composer outdated --direct --format=json` | No direct outdated packages reported |
| `cd frontend && npm outdated --json` | Several patch/minor updates available; no audit CVEs |

## Recommended Fix Order

1. Fix `postBySlug()` to require `published()` and add a regression test.
2. Tighten Filament policies for posts/books/users and add `canAccessPanel()` to `User`.
3. Add security headers middleware and disable `X-Powered-By`/server version disclosure.
4. Move PDF/document uploads to private storage and serve via a controlled download route.
5. Set production session/security env values and enforce HTTPS.
6. Remove hardcoded frontend localhost API calls.
7. Add password strength validation and backend package lockfile.
