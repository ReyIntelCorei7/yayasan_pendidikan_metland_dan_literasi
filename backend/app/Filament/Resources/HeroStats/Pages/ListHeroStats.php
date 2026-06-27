<?php

namespace App\Filament\Resources\HeroStats\Pages;

use App\Filament\Resources\HeroStats\HeroStatResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListHeroStats extends ListRecords
{
    protected static string $resource = HeroStatResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
