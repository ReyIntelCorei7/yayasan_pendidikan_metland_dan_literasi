<?php

namespace App\Filament\Resources\ImpactNumbers;

use App\Filament\Resources\ImpactNumbers\Pages\CreateImpactNumber;
use App\Filament\Resources\ImpactNumbers\Pages\EditImpactNumber;
use App\Filament\Resources\ImpactNumbers\Pages\ListImpactNumbers;
use App\Filament\Resources\ImpactNumbers\Schemas\ImpactNumberForm;
use App\Filament\Resources\ImpactNumbers\Tables\ImpactNumbersTable;
use App\Models\ImpactNumber;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ImpactNumberResource extends Resource
{
    protected static ?string $model = ImpactNumber::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function getNavigationGroup(): ?string { return 'Halaman Dampak'; }
    public static function getNavigationSort(): ?int { return 2; }
    public static function getNavigationLabel(): string { return 'Impact Number'; }

    public static function form(Schema $schema): Schema
    {
        return ImpactNumberForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ImpactNumbersTable::configure($table);
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
            'index' => ListImpactNumbers::route('/'),
            'create' => CreateImpactNumber::route('/create'),
            'edit' => EditImpactNumber::route('/{record}/edit'),
        ];
    }
}
