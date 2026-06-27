<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrgChartNode extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
        'subtitle',
        'level',
        'order',
        'parent_id',
    ];

    public function parent()
    {
        return $this->belongsTo(OrgChartNode::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(OrgChartNode::class, 'parent_id');
    }

    public function teamMembers()
    {
        return $this->hasMany(TeamMember::class);
    }
}
