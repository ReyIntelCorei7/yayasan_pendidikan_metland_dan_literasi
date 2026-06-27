<?php

namespace App\Filament\Resources\OrgChartNodes\Pages;

use App\Filament\Resources\OrgChartNodes\OrgChartNodeResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListOrgChartNodes extends ListRecords
{
    protected static string $resource = OrgChartNodeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
