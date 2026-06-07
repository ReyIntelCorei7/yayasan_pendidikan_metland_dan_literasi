<?php

return [
    'paths' => ['api/*', 'storage/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], // Mengizinkan semua domain sementara waktu karena domain production belum ada
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 86400, // Cache preflight 1 hari
    'supports_credentials' => false,
];
