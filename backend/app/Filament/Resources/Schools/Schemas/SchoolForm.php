<?php

namespace App\Filament\Resources\Schools\Schemas;

use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class SchoolForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name.id')
                    ->label('Name (Indonesian)')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(function (string $operation, $state, $set) {
                        $slug = \Illuminate\Support\Str::slug($state);
                        if (!empty($slug)) {
                            $set('slug', \App\Models\School::generateUniqueSlug($state));
                        }
                    }),
                TextInput::make('name.en')
                    ->label('Name (English)')
                    ->required(),
                TextInput::make('slug')
                    ->unique(ignoreRecord: true)
                    ->label('Slug URL')
                    ->helperText('Otomatis terisi dari nama. Bisa diedit manual jika perlu.')
                    ->placeholder('otomatis-dari-nama')
                    ->prefix(fn () => url('/schools') . '/')
                    ->suffixIcon('heroicon-o-link'),
                TextInput::make('tagline.id')
                    ->label('Tagline (Indonesian)')
                    ->required(),
                TextInput::make('tagline.en')
                    ->label('Tagline (English)')
                    ->required(),
                TextInput::make('level.id')
                    ->label('Level (Indonesian)')
                    ->required(),
                TextInput::make('level.en')
                    ->label('Level (English)')
                    ->required(),
                Textarea::make('description.id')
                    ->label('Description (Indonesian)')
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('description.en')
                    ->label('Description (English)')
                    ->required()
                    ->columnSpanFull(),
                Repeater::make('features')
                    ->label('Featured Programs')
                    ->schema([
                        TextInput::make('id')->label('Feature (Indonesian)')->required(),
                        TextInput::make('en')->label('Feature (English)')->required(),
                    ])
                    ->columnSpanFull(),
                Repeater::make('stats')
                    ->label('Facts & Figures')
                    ->schema([
                        TextInput::make('value')->required(),
                        TextInput::make('label.id')->label('Label (Indonesian)')->required(),
                        TextInput::make('label.en')->label('Label (English)')->required(),
                    ])
                    ->columns(3)
                    ->columnSpanFull(),
                FileUpload::make('image')
                    ->image()
                    ->directory('schools')
                    ->columnSpanFull(),
                ColorPicker::make('color')
                    ->required(),
                TextInput::make('website')
                    ->url()
                    ->maxLength(255),
                TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(0),
                Toggle::make('is_active')
                    ->required()
                    ->default(true),
            ]);
    }
}
