<?php

namespace App\Filament\Resources\HomeStats;

use App\Filament\Resources\HomeStats\Pages\CreateExperienceStat;
use App\Filament\Resources\HomeStats\Pages\EditExperienceStat;
use App\Filament\Resources\HomeStats\Pages\ListExperienceStats;
use App\Models\ImpactStat;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;

class ExperienceStatResource extends Resource
{
    protected static ?string $model = ImpactStat::class;

    public static function getNavigationIcon(): string|null { return 'heroicon-o-chart-bar'; }
    public static function getNavigationGroup(): ?string { return 'Halaman Dampak'; }
    public static function getNavigationSort(): ?int { return 1; }
    public static function getNavigationLabel(): string { return 'Statistik Dampak (Pengalaman)'; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Data Statistik')->schema([
                TextInput::make('value')
                    ->required()
                    ->numeric()
                    ->label('Nilai Angka (misal: 150)'),
                TextInput::make('suffix')
                    ->maxLength(10)
                    ->default('+')
                    ->label('Suffix (misal: +, %, K)'),
                TextInput::make('label.id')
                    ->required()
                    ->maxLength(255)
                    ->label('Label (Indonesian)'),
                TextInput::make('label.en')
                    ->required()
                    ->maxLength(255)
                    ->label('Label (English)'),
                TextInput::make('sort_order')
                    ->numeric()
                    ->default(0)
                    ->label('Sort Order'),
            ])->columns(2),

            Section::make('Deskripsi')->schema([
                Textarea::make('description.id')
                    ->required()
                    ->rows(3)
                    ->label('Deskripsi Singkat (Indonesian)')
                    ->columnSpanFull(),
                Textarea::make('description.en')
                    ->required()
                    ->rows(3)
                    ->label('Deskripsi Singkat (English)')
                    ->columnSpanFull(),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('value')
                    ->numeric()
                    ->sortable()
                    ->label('Nilai'),
                Tables\Columns\TextColumn::make('suffix')
                    ->label('Suffix'),
                Tables\Columns\TextColumn::make('label')
                    ->searchable()
                    ->label('Label')
                    ->formatStateUsing(fn ($state) => is_array($state) ? ($state['id'] ?? '') : $state),
                Tables\Columns\TextColumn::make('description')
                    ->limit(60)
                    ->label('Deskripsi')
                    ->formatStateUsing(fn ($state) => is_array($state) ? ($state['id'] ?? '') : $state),
                Tables\Columns\TextColumn::make('sort_order')
                    ->sortable()
                    ->label('Order'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Dibuat')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('id')
            ->filters([])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListExperienceStats::route('/'),
            'create' => CreateExperienceStat::route('/create'),
            'edit'   => EditExperienceStat::route('/{record}/edit'),
        ];
    }
}
