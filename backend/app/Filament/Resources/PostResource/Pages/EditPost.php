<?php
namespace App\Filament\Resources\PostResource\Pages;

use App\Filament\Resources\PostResource;
use App\Models\Post;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPost extends EditRecord
{
    protected static string $resource = PostResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\DeleteAction::make()];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    /**
     * Setelah artikel diperbarui:
     * Jika is_important = true, matikan is_important pada semua artikel lain.
     */
    protected function afterSave(): void
    {
        /** @var Post $record */
        $record = $this->record;

        if ($record->is_important) {
            Post::where('is_important', true)
                ->where('id', '!=', $record->id)
                ->update(['is_important' => false]);
        }
    }
}
