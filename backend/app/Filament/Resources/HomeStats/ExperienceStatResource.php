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
    public static function getNavigationGroup(): ?string { return 'Home Page'; }
    public static function getNavigationSort(): ?int { return 3; }
    public static function getNavigationLabel(): string { return 'Pengalaman'; }

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
                TextInput::make('label')
                    ->required()
                    ->maxLength(255)
                    ->label('Label (misal: Penghargaan, Siswa Terdidik)'),
                TextInput::make('icon')
                    ->maxLength(100)
                    ->label('Icon (heroicon name, misal: heroicon-o-trophy)')
                    ->placeholder('heroicon-o-trophy'),
            ])->columns(2),

            Section::make('Deskripsi')->schema([
                Textarea::make('description')
                    ->required()
                    ->rows(3)
                    ->label('Deskripsi Singkat')
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
                    ->label('Label'),
                Tables\Columns\TextColumn::make('description')
                    ->limit(60)
                    ->label('Deskripsi'),
                Tables\Columns\TextColumn::make('icon')
                    ->label('Icon')
                    ->toggleable(isToggledHiddenByDefault: true),
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
