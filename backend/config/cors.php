<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['GET', 'HEAD', 'OPTIONS'],
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')], // Dibatasi ke frontend URL untuk keamanan
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['Accept', 'Content-Type', 'X-Requested-With', 'X-XSRF-TOKEN'],
    'exposed_headers' => ['ETag', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    'max_age' => 86400, // Cache preflight 1 hari
    'supports_credentials' => false,
];
