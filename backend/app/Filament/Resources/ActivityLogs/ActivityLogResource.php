<?php

namespace App\Filament\Resources\ActivityLogs;

use App\Filament\Resources\ActivityLogs\Pages\ListActivityLogs;
use App\Models\ActivityLog;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables;
use Filament\Tables\Table;

class ActivityLogResource extends Resource
{
    protected static ?string $model = ActivityLog::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentList;

    public static function getNavigationGroup(): ?string
    {
        return 'Pengaturan';
    }

    public static function getNavigationSort(): ?int
    {
        return 100;
    }

    public static function getNavigationLabel(): string
    {
        return 'Audit Log';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Waktu'),
                Tables\Columns\TextColumn::make('event')
                    ->badge()
                    ->label('Aksi'),
                Tables\Columns\TextColumn::make('user.email')
                    ->searchable()
                    ->label('Admin'),
                Tables\Columns\TextColumn::make('model_type')
                    ->formatStateUsing(fn (string $state): string => class_basename($state))
                    ->searchable()
                    ->label('Model'),
                Tables\Columns\TextColumn::make('model_id')
                    ->label('Record ID'),
                Tables\Columns\TextColumn::make('ip_address')
                    ->label('IP'),
                Tables\Columns\TextColumn::make('checksum')
                    ->formatStateUsing(fn (?string $state): string => $state ? substr($state, 0, 12) : '-')
                    ->label('Checksum'),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('event')
                    ->options([
                        'created' => 'Created',
                        'updated' => 'Updated',
                        'deleted' => 'Deleted',
                    ]),
            ])
            ->recordActions([])
            ->toolbarActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListActivityLogs::route('/'),
        ];
    }
}
