<?php

namespace App\Filament\Resources\HomePrograms;

use App\Filament\Resources\HomePrograms\Pages\CreateProgram;
use App\Filament\Resources\HomePrograms\Pages\EditProgram;
use App\Filament\Resources\HomePrograms\Pages\ListPrograms;
use App\Models\Program;
use App\Support\SafeImageUpload;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
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
    public static function getNavigationGroup(): ?string { return 'Halaman Beranda'; }
    public static function getNavigationSort(): ?int { return 3; }
    public static function getNavigationLabel(): string { return 'Fokus Utama (Program)'; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Informasi Program')->schema([
                TextInput::make('title')
                    ->required()
                    ->maxLength(255)
                    ->label('Judul Program')
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn (string $operation, $state, $set) =>
                        $operation === 'create' ? $set('slug', Str::slug($state)) : null
                    ),
                TextInput::make('slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(Program::class, 'slug', ignoreRecord: true)
                    ->label('Slug URL'),
                TextInput::make('tagline')
                    ->maxLength(255)
                    ->label('Tagline'),
                Select::make('category')
                    ->options([
                        'education'   => 'Pendidikan',
                        'health'      => 'Kesehatan',
                        'livelihoods' => 'Penghidupan',
                    ])
                    ->required()
                    ->label('Kategori'),
            ])->columns(2),

            Section::make('Deskripsi')->schema([
                Textarea::make('description')
                    ->required()
                    ->rows(4)
                    ->label('Deskripsi Program')
                    ->columnSpanFull(),
            ]),

            Section::make('Pengaturan')->schema([
                TextInput::make('order')
                    ->numeric()
                    ->default(0)
                    ->label('Urutan Tampil'),
                Toggle::make('is_featured')
                    ->default(false)
                    ->label('Tampilkan di Fokus Utama (Beranda)'),
            ])->columns(2),


        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->limit(50)
                    ->label('Judul'),
                Tables\Columns\TextColumn::make('category')
                    ->badge()
                    ->label('Kategori'),
                Tables\Columns\TextColumn::make('order')
                    ->numeric()
                    ->sortable()
                    ->label('Urutan'),
                Tables\Columns\IconColumn::make('is_featured')
                    ->boolean()
                    ->label('Di Beranda'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Dibuat')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('order')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Ditampilkan di Beranda'),
                Tables\Filters\SelectFilter::make('category')
                    ->options([
                        'education'   => 'Pendidikan',
                        'health'      => 'Kesehatan',
                        'livelihoods' => 'Penghidupan',
                    ])
                    ->label('Kategori'),
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
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListPrograms::route('/'),
            'create' => CreateProgram::route('/create'),
            'edit'   => EditProgram::route('/{record}/edit'),
        ];
    }
}
