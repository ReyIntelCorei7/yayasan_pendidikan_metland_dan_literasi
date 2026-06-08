<?php

namespace App\Filament\Resources\HomeStats\Pages;

use App\Filament\Resources\HomeStats\ExperienceStatResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListExperienceStats extends ListRecords
{
    protected static string $resource = ExperienceStatResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
