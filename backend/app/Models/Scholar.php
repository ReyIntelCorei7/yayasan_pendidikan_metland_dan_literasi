<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scholar extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'country',
        'flag',
        'quote',
        'photo',
        'program',
        'graduation_year',
        'is_featured',
    ];

    protected $casts = [
        'graduation_year' => 'integer',
        'is_featured' => 'boolean',
    ];
}
