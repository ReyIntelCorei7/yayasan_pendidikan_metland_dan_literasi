<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PostResource\Pages;
use App\Models\Post;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Set;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;
use Illuminate\Support\Str;

class PostResource extends Resource
{
    protected static ?string $model = Post::class;

    public static function getNavigationIcon(): string|null { return 'heroicon-o-newspaper'; }
    public static function getNavigationGroup(): ?string { return 'Content'; }
    public static function getNavigationSort(): ?int { return 2; }
    public static function getNavigationLabel(): string { return 'Artikel'; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Artikel')->schema([
                TextInput::make('title')->required()->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn (string $state, Set $set) => $set('slug', Str::slug($state))),
                TextInput::make('slug')->required()->maxLength(255)->unique(ignoreRecord: true),
                Select::make('category')
                    ->options([
                        'Education' => 'Education', 'Health' => 'Health', 'Reports' => 'Reports',
                        'Stories' => 'Stories', 'Partnerships' => 'Partnerships', 'Livelihoods' => 'Livelihoods',
                    ])->required(),
                Textarea::make('excerpt')->required()->rows(3),
                RichEditor::make('body')->required()->columnSpanFull(),
                FileUpload::make('featured_image')->image()->directory('posts'),
            ])->columns(2),

            Section::make('Author & Publishing')->schema([
                TextInput::make('author_name')->required(),
                TextInput::make('author_title'),
                FileUpload::make('author_photo')->image()->directory('authors')->avatar(),
                DatePicker::make('published_at')->default(now()),
                TextInput::make('reading_time')->numeric()->default(5)->suffix('min'),
                Toggle::make('is_published')->default(true),
            ])->columns(3),

            Section::make('Tags')->schema([
                Repeater::make('tags')->relationship()
                    ->schema([TextInput::make('tag')->required()])
                    ->defaultItems(0)->grid(3),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('featured_image')->label('Image')->circular(),
                Tables\Columns\TextColumn::make('title')->searchable()->sortable()->limit(40),
                Tables\Columns\TextColumn::make('category')->badge(),
                Tables\Columns\TextColumn::make('author_name')->label('Author')->searchable(),
                Tables\Columns\IconColumn::make('is_published')->boolean(),
                Tables\Columns\TextColumn::make('published_at')->date()->sortable(),
                Tables\Columns\TextColumn::make('reading_time')->suffix(' min')->sortable(),
            ])
            ->defaultSort('published_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('category'),
                Tables\Filters\TernaryFilter::make('is_published'),
            ])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->bulkActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPosts::route('/'),
            'create' => Pages\CreatePost::route('/create'),
            'edit' => Pages\EditPost::route('/{record}/edit'),
        ];
    }
}
