# Production Security Deployment Notes

Use these snippets as deployment guidance. Keep real secrets out of Git and copy `backend/.env.production.example` into the server's private `.env`.

## Apache

```apache
ServerTokens Prod
ServerSignature Off
TraceEnable Off

<IfModule mod_headers.c>
    Header always unset X-Powered-By
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"
</IfModule>

<VirtualHost *:80>
    ServerName example.org
    Redirect permanent / https://example.org/
</VirtualHost>

<VirtualHost *:443>
    ServerName example.org
    DocumentRoot "C:/laragon/www/Revisian_yayasan_literasi_metschoo-v2/backend/public"

    SSLEngine on
    SSLCertificateFile "C:/path/to/fullchain.pem"
    SSLCertificateKeyFile "C:/path/to/privkey.pem"
    SSLProtocol -all +TLSv1.2 +TLSv1.3

    <Directory "C:/laragon/www/Revisian_yayasan_literasi_metschoo-v2/backend/public">
        AllowOverride All
        Options -Indexes
        Require all granted
    </Directory>
</VirtualHost>
```

## PHP

```ini
expose_php = Off
display_errors = Off
log_errors = On
allow_url_include = Off
session.cookie_httponly = 1
session.cookie_secure = 1
session.use_strict_mode = 1
session.cookie_samesite = Lax
upload_max_filesize = 20M
post_max_size = 24M
max_execution_time = 60
max_input_time = 60
```

Only disable PHP functions after confirming Filament, image processing, and deployment scripts do not need them:

```ini
disable_functions = exec,passthru,shell_exec,system,proc_open,popen
```

## MySQL

```sql
CREATE USER 'yayasan_app_user'@'localhost' IDENTIFIED BY 'use-a-long-random-password';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP ON yayasan_metland.* TO 'yayasan_app_user'@'localhost';
FLUSH PRIVILEGES;
```

Use a separate migration/deployment user if you want the runtime user to avoid `CREATE`, `ALTER`, and `DROP`.

## Laravel Release Checklist

```powershell
cd C:\laragon\www\Revisian_yayasan_literasi_metschoo-v2\backend
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

cd ..\frontend
npm ci
npm run build
```

Confirm after deployment:

```powershell
curl.exe -I https://example.org/api/v1/posts
curl.exe -I https://example.org/admin
```

Expected: HTTPS, no `X-Powered-By`, security headers present, HSTS present, and no stack traces with `APP_DEBUG=false`.

## Reverse Proxy

Leave `TRUSTED_PROXIES` empty when Laravel is directly exposed by Apache/Nginx. If a load balancer, CDN, or reverse proxy sits in front of Laravel, set `TRUSTED_PROXIES` to the exact proxy IP/CIDR list only. Do not use `*`, because spoofed forwarding headers can weaken IP-based rate limits and audit logs.