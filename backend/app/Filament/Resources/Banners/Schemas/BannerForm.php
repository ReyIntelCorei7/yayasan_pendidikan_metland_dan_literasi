<?php

namespace App\Filament\Resources\Banners\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

use Intervention\Image\Laravel\Facades\Image;
use Intervention\Image\Encoders\WebpEncoder;
use Illuminate\Support\Str;

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
                    ->directory('banners')
                    ->disk('public')
                    ->saveUploadedFileUsing(function ($file) {
                        $image = Image::decode(file_get_contents($file->getRealPath()));
                        $encoded = $image->encode(new WebpEncoder(80));
                        
                        $filename = 'banners/' . Str::random(20) . '.webp';
                        $path = storage_path('app/public/' . $filename);
                        
                        if (!file_exists(dirname($path))) {
                            mkdir(dirname($path), 0755, true);
                        }
                        
                        file_put_contents($path, (string) $encoded);
                        
                        return $filename;
                    })
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
