<?php

namespace Database\Seeders;

use App\Models\OrgChartNode;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class OrgChartSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        OrgChartNode::truncate();
        Schema::enableForeignKeyConstraints();

        $l1 = OrgChartNode::create(['label' => 'Rapat Pembina', 'level' => 1, 'order' => 1]);

        $l2a = OrgChartNode::create(['label' => 'Dewan Pengawas', 'level' => 2, 'order' => 1, 'parent_id' => $l1->id]);
        $l2b = OrgChartNode::create(['label' => 'Dewan Pembina', 'level' => 2, 'order' => 2, 'parent_id' => $l1->id]);

        $l3 = OrgChartNode::create(['label' => 'Pengurus Yayasan', 'subtitle' => 'Ketua Umum · Sekretaris · Bendahara', 'level' => 3, 'order' => 1, 'parent_id' => $l1->id]);

        $l4a = OrgChartNode::create(['label' => 'Bidang Pendidikan', 'level' => 4, 'order' => 1, 'parent_id' => $l3->id]);
        $l4b = OrgChartNode::create(['label' => 'Bidang Keuangan', 'level' => 4, 'order' => 2, 'parent_id' => $l3->id]);
        $l4c = OrgChartNode::create(['label' => 'Bidang Humas & Kemitraan', 'level' => 4, 'order' => 3, 'parent_id' => $l3->id]);

        $tk = OrgChartNode::create(['label' => 'TK Tunas Metropolitan', 'level' => 5, 'order' => 1, 'parent_id' => $l4a->id]);
        $sd = OrgChartNode::create(['label' => 'SD Tunas Metropolitan', 'level' => 5, 'order' => 2, 'parent_id' => $l4a->id]);
        $smk1 = OrgChartNode::create(['label' => 'SMK Pariwisata Metland Cileungsi', 'level' => 5, 'order' => 3, 'parent_id' => $l4a->id]);
        $smk2 = OrgChartNode::create(['label' => 'SMK Pariwisata Metland Cibitung', 'level' => 5, 'order' => 4, 'parent_id' => $l4a->id]);
        $college = OrgChartNode::create(['label' => 'Metland College', 'level' => 5, 'order' => 5, 'parent_id' => $l4a->id]);

        // Assign some members to nodes
        \App\Models\TeamMember::where('name', 'James Okonkwo')->update(['org_chart_node_id' => $l3->id]);
        \App\Models\TeamMember::where('name', 'Michael Chen')->update(['org_chart_node_id' => $l4b->id]);
        \App\Models\TeamMember::where('name', 'Sarah Johnson')->update(['org_chart_node_id' => $l4c->id]);
        \App\Models\TeamMember::where('name', 'Grace Mwangi')->update(['org_chart_node_id' => $l4a->id]);
        \App\Models\TeamMember::where('name', 'Dr. Strive Masiyiwa')->update(['org_chart_node_id' => $l1->id]);
    }
}
