<?php

namespace App\Filament\Resources\HeroStats;

use App\Filament\Resources\HeroStats\Pages\CreateHeroStat;
use App\Filament\Resources\HeroStats\Pages\EditHeroStat;
use App\Filament\Resources\HeroStats\Pages\ListHeroStats;
use App\Filament\Resources\HeroStats\Schemas\HeroStatForm;
use App\Filament\Resources\HeroStats\Tables\HeroStatsTable;
use App\Models\HeroStat;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class HeroStatResource extends Resource
{
    protected static ?string $model = HeroStat::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function getNavigationGroup(): ?string { return 'Halaman Beranda'; }
    public static function getNavigationSort(): ?int { return 2; }
    public static function getNavigationLabel(): string { return 'Statistik Utama'; }

    public static function form(Schema $schema): Schema
    {
        return HeroStatForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return HeroStatsTable::configure($table);
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
            'index' => ListHeroStats::route('/'),
            'create' => CreateHeroStat::route('/create'),
            'edit' => EditHeroStat::route('/{record}/edit'),
        ];
    }
}
