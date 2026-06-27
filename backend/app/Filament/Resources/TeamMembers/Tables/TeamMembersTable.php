<?php

namespace App\Filament\Resources\TeamMembers\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Table;

class TeamMembersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('photo')
                    ->disk('public')
                    ->label('Foto')
                    ->circular()
                    ->size(48),
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->label('Nama Lengkap'),
                TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->label('Jabatan'),
                TextColumn::make('group')
                    ->badge()
                    ->sortable()
                    ->label('Kelompok'),
                TextColumn::make('order')
                    ->sortable()
                    ->label('Urutan'),
            ])
            ->defaultSort('order', 'asc')
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
