<?php

namespace App\Filament\Resources\OrgChartNodes;

use App\Filament\Resources\OrgChartNodes\Pages\CreateOrgChartNode;
use App\Filament\Resources\OrgChartNodes\Pages\EditOrgChartNode;
use App\Filament\Resources\OrgChartNodes\Pages\ListOrgChartNodes;
use App\Filament\Resources\OrgChartNodes\Schemas\OrgChartNodeForm;
use App\Filament\Resources\OrgChartNodes\Tables\OrgChartNodesTable;
use App\Models\OrgChartNode;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class OrgChartNodeResource extends Resource
{
    protected static ?string $model = OrgChartNode::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function getNavigationGroup(): ?string { return 'Halaman Struktur Organisasi'; }
    public static function getNavigationSort(): ?int { return 1; }
    public static function getNavigationLabel(): string { return 'Bagan Organisasi'; }

    public static function form(Schema $schema): Schema
    {
        return OrgChartNodeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return OrgChartNodesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListOrgChartNodes::route('/'),
            'create' => CreateOrgChartNode::route('/create'),
            'edit' => EditOrgChartNode::route('/{record}/edit'),
        ];
    }
}
