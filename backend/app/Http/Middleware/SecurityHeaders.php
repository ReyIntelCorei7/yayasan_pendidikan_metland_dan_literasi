<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        header_remove('X-Powered-By');

        $response = $next($request);

        $response->headers->remove('X-Powered-By');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
        $response->headers->set(
            'Content-Security-Policy',
            "default-src 'self'; ".
            "base-uri 'self'; ".
            "object-src 'none'; ".
            "frame-ancestors 'self'; ".
            "img-src 'self' data: blob: https:; ".
            "font-src 'self' data: https://fonts.gstatic.com; ".
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ".
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; ".
            "connect-src 'self' http://localhost:* http://127.0.0.1:* ws: wss:; ".
            "frame-src 'self' https://maps.google.com https://www.google.com"
        );

        if ($request->isSecure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        return $response;
    }
}
