<?php

namespace App\Filament\Resources\HeroStats\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class HeroStatForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('value')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('suffix'),
                
                TextInput::make('label.id')
                    ->label('Label (Indonesian)')
                    ->required(),
                TextInput::make('label.en')
                    ->label('Label (English)')
                    ->required(),
                    
                \Filament\Forms\Components\Textarea::make('description.id')
                    ->label('Description (Indonesian)')
                    ->required(),
                \Filament\Forms\Components\Textarea::make('description.en')
                    ->label('Description (English)')
                    ->required(),
                    
                \Filament\Forms\Components\Select::make('icon')
                    ->options([
                        'trophy' => 'Trophy',
                        'graduation' => 'Graduation Cap',
                        'school' => 'School / Building',
                        'award' => 'Award / Ribbon',
                    ])
                    ->required()
                    ->default('trophy'),
                    
                Toggle::make('is_letter')
                    ->label('Use Custom Text (Letter)')
                    ->default(false),
                TextInput::make('letter')
                    ->label('Custom Text (e.g., "150+")')
                    ->helperText('If "Use Custom Text" is on, this will be displayed instead of the number.'),
                    
                TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(0),
                Toggle::make('is_active')
                    ->default(true),
            ]);
    }
}
