<?php

namespace App\Filament\Resources\HeroStats\Pages;

use App\Filament\Resources\HeroStats\HeroStatResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditHeroStat extends EditRecord
{
    protected static string $resource = HeroStatResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
