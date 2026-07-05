<?php

namespace App\Filament\Resources\ImpactNumbers\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ImpactNumberForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('value')
                    ->required()
                    ->numeric(),
                TextInput::make('suffix'),
                TextInput::make('label.id')
                    ->label('Label (Indonesian)')
                    ->required(),
                TextInput::make('label.en')
                    ->label('Label (English)')
                    ->required(),
                TextInput::make('heading.id')
                    ->label('Heading (Indonesian)')
                    ->required(),
                TextInput::make('heading.en')
                    ->label('Heading (English)')
                    ->required(),
                \Filament\Forms\Components\Textarea::make('description.id')
                    ->label('Description (Indonesian)')
                    ->required(),
                \Filament\Forms\Components\Textarea::make('description.en')
                    ->label('Description (English)')
                    ->required(),
                TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(0),
                Toggle::make('is_active')
                    ->required(),
            ]);
    }
}
