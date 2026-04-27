<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgramStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_id',
        'label',
        'value',
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }
}
