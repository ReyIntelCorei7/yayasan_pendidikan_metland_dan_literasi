<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LiterasiProgramResource\Pages\CreateLiterasiProgram;
use App\Filament\Resources\LiterasiProgramResource\Pages\EditLiterasiProgram;
use App\Filament\Resources\LiterasiProgramResource\Pages\ListLiterasiPrograms;
use App\Models\LiterasiProgram;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;

class LiterasiProgramResource extends Resource
{
    protected static ?string $model = LiterasiProgram::class;

    public static function getNavigationGroup(): ?string { return 'Konten & Pustaka'; }
    public static function getNavigationSort(): ?int { return 6; }
    public static function getNavigationLabel(): string { return 'Program Literasi'; }
    public static function getModelLabel(): string { return 'Program Literasi'; }
    public static function getPluralModelLabel(): string { return 'Program Literasi'; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Informasi Program')->schema([
                TextInput::make('title')
                    ->required()
                    ->maxLength(255)
                    ->label('Nama Program')
                    ->columnSpanFull(),

                Textarea::make('description')
                    ->required()
                    ->rows(4)
                    ->label('Deskripsi')
                    ->columnSpanFull(),
            ]),

            Section::make('Pengaturan')->schema([
                TextInput::make('order')
                    ->numeric()
                    ->default(0)
                    ->label('Urutan Tampil'),

                Toggle::make('is_active')
                    ->default(true)
                    ->label('Aktif / Tampilkan'),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order')
                    ->numeric()
                    ->sortable()
                    ->label('No.')
                    ->width('60px'),

                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->label('Nama Program'),

                Tables\Columns\TextColumn::make('description')
                    ->limit(80)
                    ->label('Deskripsi')
                    ->wrap(),

                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('Aktif'),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Dibuat')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('order')
            ->reorderable('order')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Status Aktif'),
            ])
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

    public static function getPages(): array
    {
        return [
            'index'  => ListLiterasiPrograms::route('/'),
            'create' => CreateLiterasiProgram::route('/create'),
            'edit'   => EditLiterasiProgram::route('/{record}/edit'),
        ];
    }
}
