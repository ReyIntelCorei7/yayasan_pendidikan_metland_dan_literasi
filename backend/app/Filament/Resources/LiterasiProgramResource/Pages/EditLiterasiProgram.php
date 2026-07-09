<?php

namespace App\Filament\Resources\LiterasiProgramResource\Pages;

use App\Filament\Resources\LiterasiProgramResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditLiterasiProgram extends EditRecord
{
    protected static string $resource = LiterasiProgramResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\DeleteAction::make()];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
