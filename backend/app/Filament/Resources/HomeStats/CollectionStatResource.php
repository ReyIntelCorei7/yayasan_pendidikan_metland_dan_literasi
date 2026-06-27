<?php

namespace App\Filament\Resources\HomeStats;

use App\Filament\Resources\HomeStats\Pages\CreateCollectionStat;
use App\Filament\Resources\HomeStats\Pages\EditCollectionStat;
use App\Filament\Resources\HomeStats\Pages\ListCollectionStats;
use App\Models\CollectionStat;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;

class CollectionStatResource extends Resource
{
    protected static ?string $model = CollectionStat::class;

    public static function getNavigationIcon(): string|null { return 'heroicon-o-book-open'; }
    public static function getNavigationGroup(): ?string { return 'Halaman Literasi'; }
    public static function getNavigationSort(): ?int { return 1; }
    public static function getNavigationLabel(): string { return 'Koleksi Perpustakaan'; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Data Koleksi')->schema([
                TextInput::make('value')
                    ->required()
                    ->numeric()
                    ->label('Nilai Angka (misal: 1200)'),
                TextInput::make('suffix')
                    ->maxLength(10)
                    ->default('+')
                    ->label('Suffix (misal: +)'),
                TextInput::make('title.id')
                    ->required()
                    ->maxLength(255)
                    ->label('Judul (Indonesian)'),
                TextInput::make('title.en')
                    ->required()
                    ->maxLength(255)
                    ->label('Judul (English)'),
                TextInput::make('sort_order')
                    ->numeric()
                    ->default(0)
                    ->label('Urutan'),
                Toggle::make('is_active')
                    ->default(true)
                    ->label('Is Active'),
            ])->columns(2),

            Section::make('Deskripsi')->schema([
                Textarea::make('description.id')
                    ->required()
                    ->rows(3)
                    ->label('Deskripsi (Indonesian)')
                    ->columnSpanFull(),
                Textarea::make('description.en')
                    ->required()
                    ->rows(3)
                    ->label('Deskripsi (English)')
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
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->label('Judul')
                    ->formatStateUsing(fn ($state) => is_array($state) ? ($state['id'] ?? '') : $state),
                Tables\Columns\TextColumn::make('sort_order')
                    ->sortable()
                    ->label('Order'),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('Active'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Dibuat')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('sort_order')
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
            'index'  => ListCollectionStats::route('/'),
            'create' => CreateCollectionStat::route('/create'),
            'edit'   => EditCollectionStat::route('/{record}/edit'),
        ];
    }
}
