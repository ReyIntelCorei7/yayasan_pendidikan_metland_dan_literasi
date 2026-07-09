<?php

namespace App\Filament\Resources\LiterasiProgramResource\Pages;

use App\Filament\Resources\LiterasiProgramResource;
use Filament\Resources\Pages\CreateRecord;

class CreateLiterasiProgram extends CreateRecord
{
    protected static string $resource = LiterasiProgramResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
