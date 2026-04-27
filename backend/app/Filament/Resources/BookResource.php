<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BookResource\Pages;
use App\Models\Book;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;

class BookResource extends Resource
{
    protected static ?string $model = Book::class;

    public static function getNavigationIcon(): string|null { return 'heroicon-o-book-open'; }
    public static function getNavigationGroup(): ?string { return 'Content'; }
    public static function getNavigationSort(): ?int { return 5; }
    public static function getNavigationLabel(): string { return 'Buku Digital'; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Informasi Buku')->schema([
                TextInput::make('title')
                    ->required()
                    ->maxLength(255)
                    ->label('Judul Buku'),
                TextInput::make('author')
                    ->required()
                    ->maxLength(255)
                    ->label('Penulis'),
                Textarea::make('description')
                    ->rows(3)
                    ->label('Deskripsi'),
                Select::make('category')
                    ->options([
                        'Pendidikan' => 'Pendidikan',
                        'Literasi' => 'Literasi',
                        'Sains' => 'Sains',
                        'Fiksi' => 'Fiksi',
                        'Agama' => 'Agama',
                        'Umum' => 'Umum',
                    ])
                    ->default('Umum')
                    ->required()
                    ->label('Kategori'),
            ])->columns(2),

            Section::make('File & Media')->schema([
                FileUpload::make('cover_image')
                    ->image()
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                    ->directory('covers')
                    ->disk('public')
                    ->label('Cover Buku'),
                FileUpload::make('pdf_file')
                    ->acceptedFileTypes(['application/pdf'])
                    ->directory('books')
                    ->disk('public')
                    ->required()
                    ->label('File PDF'),
            ])->columns(2),

            Section::make('Pengaturan')->schema([
                Toggle::make('is_published')
                    ->default(false)
                    ->label('Publikasikan Buku'),
                TextInput::make('order')
                    ->numeric()
                    ->default(0)
                    ->label('Urutan'),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('cover_image')
                    ->disk('public')
                    ->label('Cover')
                    ->square(),
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->label('Judul'),
                Tables\Columns\TextColumn::make('author')
                    ->searchable()
                    ->label('Penulis'),
                Tables\Columns\TextColumn::make('category')
                    ->badge()
                    ->label('Kategori'),
                Tables\Columns\IconColumn::make('is_published')
                    ->boolean()
                    ->label('Published'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Dibuat'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->options([
                        'Pendidikan' => 'Pendidikan',
                        'Literasi' => 'Literasi',
                        'Sains' => 'Sains',
                        'Fiksi' => 'Fiksi',
                        'Agama' => 'Agama',
                        'Umum' => 'Umum',
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
            'index' => Pages\ListBooks::route('/'),
            'create' => Pages\CreateBook::route('/create'),
            'edit' => Pages\EditBook::route('/{record}/edit'),
        ];
    }
}
