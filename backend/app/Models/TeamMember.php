<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'title', 'group', 'org_chart_node_id', 'department', 'bio', 'photo', 'order', 'linkedin', 'twitter',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function orgChartNode()
    {
        return $this->belongsTo(OrgChartNode::class);
    }
}
