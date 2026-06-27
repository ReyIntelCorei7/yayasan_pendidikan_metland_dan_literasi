<?php

namespace App\Filament\Resources\OrgChartNodes\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Placeholder;
use Filament\Schemas\Components\Section;

class OrgChartNodeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Node Details')->schema([
                    TextInput::make('label')
                        ->required()
                        ->label('Nama Unit / Kotak'),
                    TextInput::make('subtitle')
                        ->label('Subjudul (opsional)')
                        ->helperText('Hanya tampil di level Pengurus (misal: "Ketua Umum · Sekretaris · Bendahara")'),
                    Select::make('level')
                        ->options([
                            1 => 'Level 1 (Rapat Pembina)',
                            2 => 'Level 2 (Pengawas / Pembina)',
                            3 => 'Level 3 (Pengurus Yayasan)',
                            4 => 'Level 4 (Bidang-bidang)',
                            5 => 'Level 5 (Unit Sekolah)',
                        ])
                        ->required()
                        ->label('Hierarki / Level'),
                    TextInput::make('order')
                        ->numeric()
                        ->default(0)
                        ->label('Urutan Tampil (Kiri ke Kanan)'),
                    Select::make('parent_id')
                        ->relationship('parent', 'label')
                        ->label('Induk (Parent Node)')
                        ->nullable(),
                ])->columns(2),

                Section::make('Anggota yang Di-assign')
                    ->schema([
                        Placeholder::make('assigned_members')
                            ->label('')
                            ->content(function ($record) {
                                if (!$record) return 'Simpan node terlebih dahulu untuk melihat anggota.';

                                $members = $record->teamMembers()->orderBy('order')->get();

                                if ($members->isEmpty()) {
                                    return 'Belum ada anggota yang di-assign ke node ini. Anda bisa assign anggota melalui menu "Tim Pengurus".';
                                }

                                return $members->map(fn ($m) => "• {$m->name} — {$m->title}")->implode("\n");
                            }),
                    ])
                    ->collapsible()
                    ->collapsed(false),
            ]);
    }
}
