<?php

namespace App\Filament\Resources\ImpactNumbers\Pages;

use App\Filament\Resources\ImpactNumbers\ImpactNumberResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditImpactNumber extends EditRecord
{
    protected static string $resource = ImpactNumberResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
