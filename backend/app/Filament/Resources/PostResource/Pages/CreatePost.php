<?php
namespace App\Filament\Resources\PostResource\Pages;

use App\Filament\Resources\PostResource;
use App\Models\Post;
use Filament\Resources\Pages\CreateRecord;

class CreatePost extends CreateRecord
{
    protected static string $resource = PostResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    /**
     * Setelah artikel baru disimpan:
     * Jika is_important = true, matikan is_important pada semua artikel lain.
     */
    protected function afterCreate(): void
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
