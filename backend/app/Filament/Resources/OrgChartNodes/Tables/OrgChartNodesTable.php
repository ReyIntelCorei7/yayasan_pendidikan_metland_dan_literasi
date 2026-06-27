<?php

namespace App\Filament\Resources\OrgChartNodes\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class OrgChartNodesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('label')
                    ->searchable()
                    ->sortable()
                    ->label('Nama Kotak'),
                TextColumn::make('level')
                    ->sortable()
                    ->badge()
                    ->label('Level'),
                TextColumn::make('order')
                    ->sortable()
                    ->label('Urutan'),
                TextColumn::make('parent.label')
                    ->label('Induk')
                    ->sortable(),
            ])
            ->defaultSort('level', 'asc')
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
