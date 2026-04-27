<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ScholarResource\Pages;
use App\Models\Scholar;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;

class ScholarResource extends Resource
{
    protected static ?string $model = Scholar::class;

    public static function getNavigationIcon(): string|null { return 'heroicon-o-user-group'; }
    public static function getNavigationGroup(): ?string { return 'Content'; }
    public static function getNavigationSort(): ?int { return 3; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Scholar Details')->schema([
                TextInput::make('name')->required()->maxLength(255),
                TextInput::make('country')->required(),
                TextInput::make('flag')->required()->maxLength(10)->label('Flag Emoji'),
                Textarea::make('quote')->required()->rows(3),
                FileUpload::make('photo')->image()->directory('scholars')->avatar(),
                TextInput::make('program')->required(),
                TextInput::make('graduation_year')->numeric()->required(),
                Toggle::make('is_featured')->default(false),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('photo')->circular(),
                Tables\Columns\TextColumn::make('name')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('country')->searchable(),
                Tables\Columns\TextColumn::make('program')->searchable(),
                Tables\Columns\TextColumn::make('graduation_year')->sortable(),
                Tables\Columns\IconColumn::make('is_featured')->boolean(),
            ])
            ->filters([Tables\Filters\TernaryFilter::make('is_featured')])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->bulkActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListScholars::route('/'),
            'create' => Pages\CreateScholar::route('/create'),
            'edit' => Pages\EditScholar::route('/{record}/edit'),
        ];
    }
}
