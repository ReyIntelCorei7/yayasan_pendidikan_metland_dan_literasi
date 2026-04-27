<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ImpactStatResource\Pages;
use App\Models\ImpactStat;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;

class ImpactStatResource extends Resource
{
    protected static ?string $model = ImpactStat::class;

    public static function getNavigationIcon(): string|null { return 'heroicon-o-chart-bar'; }
    public static function getNavigationGroup(): ?string { return 'Content'; }
    public static function getNavigationSort(): ?int { return 5; }
    public static function getNavigationLabel(): string { return 'Impact Stats'; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Impact Stat')->schema([
                TextInput::make('label')->required(),
                TextInput::make('value')->numeric()->required(),
                TextInput::make('suffix')->maxLength(10),
                Textarea::make('description')->required()->rows(3),
                Select::make('icon')
                    ->options([
                        'Heart' => 'Heart', 'Globe' => 'Globe',
                        'Calendar' => 'Calendar', 'Utensils' => 'Utensils',
                        'Users' => 'Users', 'BookOpen' => 'BookOpen', 'Award' => 'Award',
                    ])->required(),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('label')->searchable(),
                Tables\Columns\TextColumn::make('value')->numeric()->sortable(),
                Tables\Columns\TextColumn::make('suffix'),
                Tables\Columns\TextColumn::make('icon'),
            ])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->bulkActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListImpactStats::route('/'),
            'create' => Pages\CreateImpactStat::route('/create'),
            'edit' => Pages\EditImpactStat::route('/{record}/edit'),
        ];
    }
}
