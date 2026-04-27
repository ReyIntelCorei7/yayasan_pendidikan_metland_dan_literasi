<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'title',
        'department',
        'bio',
        'photo',
        'order',
        'linkedin',
        'twitter',
    ];

    protected $casts = [
        'order' => 'integer',
    ];
}
