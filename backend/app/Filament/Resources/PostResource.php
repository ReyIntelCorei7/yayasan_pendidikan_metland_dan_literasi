<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PostResource\Pages;
use App\Models\Post;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\DatePicker;
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
    public static function getNavigationLabel(): string { return 'Artikel / Berita'; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Informasi Artikel')->schema([
                TextInput::make('title')
                    ->required()
                    ->maxLength(255)
                    ->label('Judul Artikel')
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn (string $operation, $state, $set) =>
                        $operation === 'create' ? $set('slug', Str::slug($state)) : null
                    ),
                TextInput::make('slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(Post::class, 'slug', ignoreRecord: true)
                    ->label('Slug URL'),
                Textarea::make('excerpt')
                    ->required()
                    ->rows(3)
                    ->label('Ringkasan / Excerpt'),
                Select::make('category')
                    ->options([
                        'Berita'      => 'Berita',
                        'Artikel'     => 'Artikel',
                        'Pendidikan'  => 'Pendidikan',
                        'Literasi'    => 'Literasi',
                        'Program'     => 'Program',
                        'Kegiatan'    => 'Kegiatan',
                    ])
                    ->required()
                    ->label('Kategori'),
            ])->columns(2),

            Section::make('Konten')->schema([
                RichEditor::make('body')
                    ->required()
                    ->label('Isi Artikel')
                    ->columnSpanFull(),
            ]),

            Section::make('Penulis & Media')->schema([
                TextInput::make('author_name')
                    ->required()
                    ->maxLength(255)
                    ->label('Nama Penulis'),
                TextInput::make('author_title')
                    ->maxLength(255)
                    ->label('Jabatan Penulis'),
                FileUpload::make('featured_image')
                    ->image()
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                    ->directory('posts')
                    ->disk('public')
                    ->maxSize(3072)
                    ->imageResizeTargetWidth('1200')
                    ->imageResizeTargetHeight('630')
                    ->label('Gambar Utama'),
                FileUpload::make('author_photo')
                    ->image()
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                    ->directory('authors')
                    ->disk('public')
                    ->maxSize(1024)
                    ->label('Foto Penulis'),
            ])->columns(2),

            Section::make('Pengaturan')->schema([
                DatePicker::make('published_at')
                    ->label('Tanggal Publikasi'),
                TextInput::make('reading_time')
                    ->numeric()
                    ->default(5)
                    ->suffix('menit')
                    ->label('Estimasi Baca'),
                Toggle::make('is_published')
                    ->default(false)
                    ->label('Publikasikan'),
            ])->columns(3),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('featured_image')
                    ->disk('public')
                    ->label('Gambar')
                    ->square()
                    ->size(48),
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->limit(50)
                    ->label('Judul'),
                Tables\Columns\TextColumn::make('category')
                    ->badge()
                    ->label('Kategori'),
                Tables\Columns\TextColumn::make('author_name')
                    ->searchable()
                    ->label('Penulis'),
                Tables\Columns\IconColumn::make('is_published')
                    ->boolean()
                    ->label('Published'),
                Tables\Columns\TextColumn::make('published_at')
                    ->date()
                    ->sortable()
                    ->label('Tanggal'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Dibuat')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->defaultPaginationPageOption(10)
            ->searchDebounce('750ms')
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->options([
                        'Berita'      => 'Berita',
                        'Artikel'     => 'Artikel',
                        'Pendidikan'  => 'Pendidikan',
                        'Literasi'    => 'Literasi',
                        'Program'     => 'Program',
                        'Kegiatan'    => 'Kegiatan',
                    ]),
                Tables\Filters\TernaryFilter::make('is_published')
                    ->label('Status Publikasi'),
            ])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->bulkActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListPosts::route('/'),
            'create' => Pages\CreatePost::route('/create'),
            'edit'   => Pages\EditPost::route('/{record}/edit'),
        ];
    }
}
