<?php

namespace App\Filament\Resources\PageContents\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PageContentsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('page')
                    ->searchable()
                    ->sortable()
                    ->label('Halaman'),
                TextColumn::make('section')
                    ->searchable()
                    ->sortable()
                    ->label('Bagian'),
                TextColumn::make('content.id')
                    ->limit(50)
                    ->label('Preview (ID)'),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
