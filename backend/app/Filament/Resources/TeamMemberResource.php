<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TeamMemberResource\Pages;
use App\Models\TeamMember;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\FileUpload;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;

class TeamMemberResource extends Resource
{
    protected static ?string $model = TeamMember::class;

    public static function getNavigationIcon(): string|null { return 'heroicon-o-users'; }
    public static function getNavigationGroup(): ?string { return 'Content'; }
    public static function getNavigationSort(): ?int { return 6; }
    public static function getNavigationLabel(): string { return 'Team Members'; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Member Details')->schema([
                TextInput::make('name')->required()->maxLength(255),
                TextInput::make('title')->required()->label('Job Title'),
                Select::make('department')
                    ->options([
                        'Leadership' => 'Leadership', 'Programs' => 'Programs',
                        'Communications' => 'Communications', 'Operations' => 'Operations',
                    ])->required(),
                Textarea::make('bio')->required()->rows(3),
                FileUpload::make('photo')->image()->directory('team')->avatar(),
                TextInput::make('order')->numeric()->default(0),
            ])->columns(2),
            Section::make('Social Media')->schema([
                TextInput::make('linkedin')->url()->prefix('https://'),
                TextInput::make('twitter')->url()->prefix('https://'),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('photo')->circular(),
                Tables\Columns\TextColumn::make('name')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('title'),
                Tables\Columns\TextColumn::make('department')->badge(),
                Tables\Columns\TextColumn::make('order')->sortable(),
            ])
            ->defaultSort('order')
            ->actions([EditAction::make(), DeleteAction::make()])
            ->bulkActions([BulkActionGroup::make([DeleteBulkAction::make()])])
            ->reorderable('order');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTeamMembers::route('/'),
            'create' => Pages\CreateTeamMember::route('/create'),
            'edit' => Pages\EditTeamMember::route('/{record}/edit'),
        ];
    }
}
