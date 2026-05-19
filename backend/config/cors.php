<?php

return [
    'paths' => ['api/*', 'storage/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 86400, // Cache preflight 1 hari
    'supports_credentials' => false,
];
