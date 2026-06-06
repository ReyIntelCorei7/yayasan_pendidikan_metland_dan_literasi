<?php

namespace App\Filament\Resources\Partners;

use App\Filament\Resources\Partners\Pages;
use App\Models\Partner;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Toggle;
use Filament\Tables;
use Filament\Tables\Table;

use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;

class PartnerResource extends Resource
{
    protected static ?string $model = Partner::class;

    public static function getNavigationIcon(): string|null { return 'heroicon-o-hand-raised'; }
    public static function getNavigationGroup(): ?string { return 'Content'; }
    public static function getNavigationSort(): ?int { return 6; }
    public static function getNavigationLabel(): string { return 'Mitra & Pendukung'; }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informasi Mitra')->schema([
                    TextInput::make('name')
                        ->required()
                        ->maxLength(255)
                        ->label('Nama Mitra'),
                    TextInput::make('website_url')
                        ->url()
                        ->maxLength(255)
                        ->label('URL Website')
                        ->placeholder('https://...'),
                ])->columns(2),

                Section::make('Logo & Pengaturan')->schema([
                    FileUpload::make('logo')
                        ->image()
                        ->directory('partners')
                        ->disk('public')
                        ->maxSize(2048) // Max 2MB
                        ->label('Logo Mitra')
                        ->required(),
                    Toggle::make('is_active')
                        ->default(true)
                        ->label('Aktif / Ditampilkan'),
                ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('logo')
                    ->disk('public')
                    ->label('Logo')
                    ->square()
                    ->size(48),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->label('Nama Mitra'),
                Tables\Columns\TextColumn::make('website_url')
                    ->searchable()
                    ->label('URL Website'),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('Aktif'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
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

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPartners::route('/'),
            'create' => Pages\CreatePartner::route('/create'),
            'edit' => Pages\EditPartner::route('/{record}/edit'),
        ];
    }
}
