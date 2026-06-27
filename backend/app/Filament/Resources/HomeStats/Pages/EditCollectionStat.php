<?php

namespace App\Filament\Resources\HomeStats\Pages;

use App\Filament\Resources\HomeStats\CollectionStatResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditCollectionStat extends EditRecord
{
    protected static string $resource = CollectionStatResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
