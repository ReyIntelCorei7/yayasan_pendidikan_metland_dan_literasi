<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HeroStat;

class HeroStatController extends Controller
{
    public function index()
    {
        $stats = HeroStat::where('is_active', true)
            ->orderBy('sort_order')
            ->take(4)
            ->get();
            
        return response()->json($stats);
    }
}
