<?php

namespace App\Filament\Resources\ImpactNumbers\Pages;

use App\Filament\Resources\ImpactNumbers\ImpactNumberResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListImpactNumbers extends ListRecords
{
    protected static string $resource = ImpactNumberResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
