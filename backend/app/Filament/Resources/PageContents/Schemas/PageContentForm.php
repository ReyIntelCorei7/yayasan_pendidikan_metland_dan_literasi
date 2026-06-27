<?php

namespace App\Filament\Resources\PageContents\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Tabs;

class PageContentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('page')
                    ->disabled()
                    ->label('Halaman'),
                TextInput::make('section')
                    ->disabled()
                    ->label('Bagian / Identifier'),
                Tabs::make('Translations')->tabs([
                    Tabs\Tab::make('Bahasa Indonesia (ID)')->schema([
                        Textarea::make('content.id')
                            ->label('Konten (ID)')
                            ->rows(4)
                            ->required(),
                    ]),
                    Tabs\Tab::make('English (EN)')->schema([
                        Textarea::make('content.en')
                            ->label('Konten (EN)')
                            ->rows(4)
                            ->nullable(),
                    ]),
                ])->columnSpanFull()
            ]);
    }
}
