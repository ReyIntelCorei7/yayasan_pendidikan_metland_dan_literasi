<?php

namespace App\Filament\Resources\PageContents;

use App\Filament\Resources\PageContents\Pages\CreatePageContent;
use App\Filament\Resources\PageContents\Pages\EditPageContent;
use App\Filament\Resources\PageContents\Pages\ListPageContents;
use App\Filament\Resources\PageContents\Schemas\PageContentForm;
use App\Filament\Resources\PageContents\Tables\PageContentsTable;
use App\Models\PageContent;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PageContentResource extends Resource
{
    protected static ?string $model = PageContent::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;
    
    public static function getNavigationGroup(): ?string { return 'Pengaturan'; }
    public static function getNavigationLabel(): string { return 'Konten Halaman'; }

    public static function form(Schema $schema): Schema
    {
        return PageContentForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PageContentsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListPageContents::route('/'),
            'edit' => EditPageContent::route('/{record}/edit'),
        ];
    }
    
    public static function canCreate(): bool
    {
        return false;
    }
}
