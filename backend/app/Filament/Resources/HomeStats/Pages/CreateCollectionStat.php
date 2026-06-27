<?php

namespace App\Filament\Resources\HomeStats\Pages;

use App\Filament\Resources\HomeStats\CollectionStatResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCollectionStat extends CreateRecord
{
    protected static string $resource = CollectionStatResource::class;
}
