<?php

namespace App\Filament\Resources\HomeStats\Pages;

use App\Filament\Resources\HomeStats\ExperienceStatResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditExperienceStat extends EditRecord
{
    protected static string $resource = ExperienceStatResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
