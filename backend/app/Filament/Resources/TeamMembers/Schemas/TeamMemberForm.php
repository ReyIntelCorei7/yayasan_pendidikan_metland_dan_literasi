<?php

namespace App\Filament\Resources\TeamMembers\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\FileUpload;

class TeamMemberForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->label('Nama Lengkap'),
                TextInput::make('title')
                    ->required()
                    ->maxLength(255)
                    ->label('Jabatan'),
                Select::make('group')
                    ->options([
                        'Pembina' => 'Pembina',
                        'Pengawas' => 'Pengawas',
                        'Pengurus' => 'Pengurus',
                    ])
                    ->required()
                    ->label('Kelompok (Group)'),
                Select::make('org_chart_node_id')
                    ->relationship('orgChartNode', 'label')
                    ->label('Posisi di Bagan Organisasi')
                    ->helperText('Pilih node bagan untuk menampilkan anggota ini di bawah bidang/unit tertentu.')
                    ->nullable()
                    ->searchable()
                    ->preload(),
                TextInput::make('department')
                    ->maxLength(255)
                    ->label('Departemen / Bidang')
                    ->nullable(),
                Textarea::make('bio')
                    ->label('Bio Singkat')
                    ->nullable(),
                FileUpload::make('photo')
                    ->image()
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                    ->directory('team')
                    ->disk('public')
                    ->label('Foto'),
                TextInput::make('order')
                    ->numeric()
                    ->default(0)
                    ->label('Urutan Tampil'),
                TextInput::make('linkedin')
                    ->url()
                    ->label('LinkedIn URL')
                    ->nullable(),
                TextInput::make('twitter')
                    ->url()
                    ->label('Twitter / X URL')
                    ->nullable(),
            ]);
    }
}
