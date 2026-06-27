<?php

namespace App\Filament\Resources\Banners\Schemas;

use App\Support\SafeImageUpload;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class BannerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Schemas\Components\Tabs::make('Translations')
                    ->tabs([
                        \Filament\Schemas\Components\Tabs\Tab::make('Bahasa Indonesia (ID)')->schema([
                            TextInput::make('title.id')->label('Judul / Keterangan (ID)'),
                        ]),
                        \Filament\Schemas\Components\Tabs\Tab::make('English (EN)')->schema([
                            TextInput::make('title.en')->label('Judul / Keterangan (EN)'),
                        ]),
                    ])->columnSpanFull(),
                FileUpload::make('image')
                    ->image()
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                    ->directory('banners')
                    ->disk('public')
                    ->maxSize(4096)
                    ->saveUploadedFileUsing(SafeImageUpload::toWebp('banners', 80))
                    ->required()
                    ->label('Gambar Utama (Otomatis jadi WebP)'),
                TextInput::make('order')
                    ->required()
                    ->numeric()
                    ->default(0),
                Toggle::make('is_active')
                    ->required(),
            ]);
    }
}
