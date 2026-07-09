<?php

namespace App\Filament\Resources\LiterasiProgramResource\Pages;

use App\Filament\Resources\LiterasiProgramResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListLiterasiPrograms extends ListRecords
{
    protected static string $resource = LiterasiProgramResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\CreateAction::make()];
    }
}
