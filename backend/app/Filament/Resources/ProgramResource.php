<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProgramResource\Pages;
use App\Models\Program;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Set;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;
use Illuminate\Support\Str;

class ProgramResource extends Resource
{
    protected static ?string $model = Program::class;

    public static function getNavigationIcon(): string|null { return 'heroicon-o-academic-cap'; }
    public static function getNavigationGroup(): ?string { return 'Content'; }
    public static function getNavigationSort(): ?int { return 1; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Program Details')->schema([
                TextInput::make('title')
                    ->required()->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn (string $state, Set $set) => $set('slug', Str::slug($state))),
                TextInput::make('slug')->required()->maxLength(255)->unique(ignoreRecord: true),
                Select::make('category')
                    ->options(['education' => 'Education', 'health' => 'Health', 'livelihoods' => 'Livelihoods'])
                    ->required(),
                TextInput::make('tagline')->required()->maxLength(255),
                Textarea::make('description')->required()->rows(4),
                FileUpload::make('image')->image()->directory('programs'),
                Toggle::make('is_featured')->default(false),
                TextInput::make('order')->numeric()->default(0),
            ])->columns(2),

            Section::make('Statistics')->schema([
                Repeater::make('stats')->relationship()->schema([
                    TextInput::make('label')->required(),
                    TextInput::make('value')->required(),
                ])->columns(2)->defaultItems(0),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')->circular(),
                Tables\Columns\TextColumn::make('title')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('category')->badge(),
                Tables\Columns\IconColumn::make('is_featured')->boolean(),
                Tables\Columns\TextColumn::make('order')->sortable(),
            ])
            ->defaultSort('order')
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->options(['education' => 'Education', 'health' => 'Health', 'livelihoods' => 'Livelihoods']),
                Tables\Filters\TernaryFilter::make('is_featured'),
            ])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->bulkActions([BulkActionGroup::make([DeleteBulkAction::make()])])
            ->reorderable('order');
    }

    public static function getRelations(): array { return []; }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPrograms::route('/'),
            'create' => Pages\CreateProgram::route('/create'),
            'edit' => Pages\EditProgram::route('/{record}/edit'),
        ];
    }
}
