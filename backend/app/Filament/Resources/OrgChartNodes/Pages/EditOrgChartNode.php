<?php

namespace App\Filament\Resources\OrgChartNodes\Pages;

use App\Filament\Resources\OrgChartNodes\OrgChartNodeResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditOrgChartNode extends EditRecord
{
    protected static string $resource = OrgChartNodeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
