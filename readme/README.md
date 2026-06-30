# Website Yayasan Pendidikan Metland & Literasi

> Website resmi Yayasan Pendidikan Metland — platform digital untuk menampilkan profil yayasan, program pendidikan, sekolah-sekolah binaan, berita/artikel, perpustakaan digital (literasi), struktur organisasi, dan informasi kontak.

---

## Daftar Isi

- [Gambaran Umum](#1-gambaran-umum-project)
- [Halaman Website](#2-halaman-halaman-website-frontend)
- [Panel Admin](#3-panel-admin-backend--filament)
- [Database](#4-database)
- [REST API](#5-rest-api-endpoints)
- [Teknologi & Library](#6-teknologi--library-yang-digunakan)
- [Struktur Folder](#7-struktur-folder-project)
- [Panduan Instalasi](#8-panduan-instalasi--langkah-demi-langkah)
- [Cara Kerja Proxy](#9-cara-kerja-proxy-frontend--backend)
- [Keamanan](#10-keamanan-yang-sudah-diterapkan)
- [Troubleshooting](#11-troubleshooting-umum)
- [Ringkasan](#12-ringkasan-ukuran-project)

---

## 1. GAMBARAN UMUM PROJECT

### Apa ini?

Website resmi **Yayasan Pendidikan Metland** — sebuah platform digital yang dibangun untuk menampilkan profil yayasan, program pendidikan, sekolah-sekolah di bawah naungan yayasan, berita/artikel, perpustakaan digital (literasi), struktur organisasi, serta informasi kontak. Website ini memiliki **dua bagian utama**:

| Komponen | Deskripsi | Teknologi |
|----------|-----------|-----------|
| **Frontend** (Website Publik) | Halaman yang dilihat oleh pengunjung umum — desain modern, animasi smooth, responsif | React 19 + TypeScript + Vite + TailwindCSS 3 |
| **Backend** (Panel Admin + API) | Dashboard admin untuk mengelola seluruh konten website + REST API yang menyuplai data ke frontend | Laravel 13 + PHP 8.3 + Filament 5 + MySQL |

### Arsitektur Sistem

```
┌─────────────────────┐         ┌─────────────────────┐
│   Pengunjung        │         │   Admin             │
│   Website           │         │   Panel             │
└────────┬────────────┘         └────────┬────────────┘
         │ Browser                       │ Browser
         ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│   Frontend          │         │   /admin            │
│   React + Vite      │────────▶│   Filament 5        │
│   Port 5173         │ /api/*  │   Port 8000         │
└─────────────────────┘         └────────┬────────────┘
                                         │
                                         ▼
                                ┌─────────────────────┐
                                │   MySQL Database    │
                                │   yayasan_metland   │
                                └─────────────────────┘
```

**Cara kerja:**
- Pengunjung membuka website → React frontend tampil di browser
- Frontend memanggil API backend (`/api/v1/...`) untuk mengambil data (program, berita, buku, dsb.)
- Admin login ke panel Filament (`/admin`) untuk mengelola semua konten
- Setiap perubahan data di admin otomatis memperbarui cache API sehingga pengunjung langsung melihat data terbaru

---

## 2. HALAMAN-HALAMAN WEBSITE (FRONTEND)

Website ini memiliki **16 halaman** yang terorganisir dalam navigasi berikut:

### 2.1 Halaman Utama (Home) — Route: `/`

Halaman landing page utama yang terdiri dari **9 section berurutan**:

| # | Section | Deskripsi |
|---|---------|-----------|
| 1 | **HeroSection** | Banner besar di atas halaman dengan judul, tagline, dan statistik utama yayasan. Menggunakan animasi GSAP + Framer Motion. Data statistik diambil dari API `/api/v1/hero-stats` |
| 2 | **MarqueeStrip** | Teks berjalan (marquee) horizontal yang menampilkan kata-kata kunci seperti motto yayasan |
| 3 | **NewsInsights** | Menampilkan berita/artikel terbaru dari API `/api/v1/posts`. Ada filter kategori dan layout grid |
| 4 | **ImpactSpotlight** | Spotlight pencapaian dan dampak yayasan, mengambil data dari API `/api/v1/impact-stats` |
| 5 | **WhatWeDo** | Menjelaskan apa yang dilakukan yayasan — pendidikan, literasi, dsb. |
| 6 | **ImpactNumbers** | Angka-angka statistik (counter animasi) tentang dampak yayasan — jumlah siswa, sekolah, dll. Menggunakan `react-countup` |
| 7 | **ProgramsGrid** | Grid program-program yayasan dari API `/api/v1/programs` |
| 8 | **PartnerLogos** | Logo mitra/partner yayasan dari API `/api/v1/partners` |
| 9 | **CTABanner** | Banner ajakan (Call to Action) di bagian bawah |

### 2.2 Profil — Route: `/profil`

| Sub-Halaman | Route | Deskripsi |
|-------------|-------|-----------|
| **Visi & Misi** | `/profil/visi-misi` | Menampilkan visi, misi, dan nilai-nilai yayasan |
| **Struktur Organisasi** | `/profil/struktur-organisasi` | Bagan organisasi interaktif + daftar team members. Data dari API `/api/v1/org-chart` dan `/api/v1/team` |

### 2.3 Our School — Route: `/our-school`

| Halaman | Route | Deskripsi |
|---------|-------|-----------|
| **Daftar Sekolah** | `/our-school` | Menampilkan semua sekolah di bawah yayasan (program sekolah dari API `/api/v1/programs`) |
| **Detail Sekolah** | `/our-school/:slug` | Detail per sekolah berdasarkan slug — deskripsi, gambar, statistik |

### 2.4 Artikel/Berita — Route: `/artikel`

| Halaman | Route | Deskripsi |
|---------|-------|-----------|
| **Daftar Artikel** | `/artikel` | Daftar semua artikel/berita dengan pagination, pencarian, dan filter kategori. Data dari API `/api/v1/posts` |
| **Detail Artikel** | `/artikel/:slug` | Detail artikel lengkap — body HTML (di-sanitasi dengan DOMPurify), gambar, tag, author, waktu baca |

### 2.5 Literasi (Perpustakaan Digital) — Route: `/literasi`

Halaman perpustakaan digital yang menampilkan koleksi buku-buku yayasan. Fitur utama:
- **Daftar buku** dengan pagination, pencarian, dan filter kategori dari API `/api/v1/books`
- **Flipbook Reader** — Pembaca buku interaktif dengan efek halaman lipat (flip) menggunakan library `pdfjs-dist`. File CSS `book-animation.css` berisi animasi 3D flip yang sangat detail
- Statistik koleksi dari API `/api/v1/collection-stats`

### 2.6 Kontak — Route: `/contact`

Halaman kontak yayasan dengan form kontak dan informasi alamat/telepon/email.

### 2.7 Halaman Legacy (Backward Compatibility)

| Route | Redirect ke |
|-------|-------------|
| `/about` | Halaman About (masih bisa diakses) |
| `/programs` | Halaman Programs |
| `/programs/:slug` | Detail Program |
| `/impact` | Halaman Impact |
| `/news` | Redirect ke Artikel |
| `/news/:slug` | Redirect ke Artikel Detail |

### 2.8 Halaman 404

Custom 404 page untuk URL yang tidak ditemukan.

---

## 3. PANEL ADMIN (BACKEND — FILAMENT)

Admin mengakses panel melalui URL: `http://localhost:8000/admin`

### Modul-Modul yang Bisa Dikelola Admin

| # | Modul (Filament Resource) | Deskripsi | Data Model |
|---|---------------------------|-----------|------------|
| 1 | **Posts (Artikel/Berita)** | CRUD berita/artikel — judul, slug, body (rich text editor), gambar featured, kategori, tag, status publish, penulis, waktu baca | `Post` |
| 2 | **Books (Buku Literasi)** | CRUD buku — judul, penulis, deskripsi, cover gambar, file PDF, kategori, status publish | `Book` |
| 3 | **Programs (Program Sekolah)** | CRUD program/sekolah — judul, slug, deskripsi, gambar, statistik, featured, urutan tampil | `Program` |
| 4 | **Banners** | Kelola banner/slider homepage — gambar, judul, urutan | `Banner` |
| 5 | **Hero Stats** | Statistik yang muncul di hero section homepage — angka, label, ikon | `HeroStat` |
| 6 | **Impact Stats** | Statistik dampak yayasan — angka pencapaian | `ImpactStat` |
| 7 | **Collection Stats** | Statistik koleksi perpustakaan digital | `CollectionStat` |
| 8 | **Partners** | Logo dan info mitra yayasan | `Partner` |
| 9 | **Team Members** | Anggota tim/pengurus yayasan — nama, jabatan, foto, bio, department, grup organisasi | `TeamMember` |
| 10 | **Org Chart Nodes** | Node bagan struktur organisasi | `OrgChartNode` |
| 11 | **Page Contents** | Konten dinamis per halaman (visi, misi, dll.) | `PageContent` |
| 12 | **Users** | Manajemen user admin — role super_admin dan admin_konten | `User` |
| 13 | **Activity Logs** | Log audit aktivitas admin (read-only) — siapa melakukan apa, kapan, dengan checksum anti-tamper | `ActivityLog` |

### Sistem Role Admin

| Role | Hak Akses |
|------|-----------|
| **super_admin** | Akses penuh — CRUD semua modul + manajemen user + hapus permanen + lihat log audit |
| **admin_konten** | Bisa membuat & mengedit konten (artikel, buku, program, dsb.) tetapi tidak bisa menghapus permanen atau mengelola user |

---

## 4. DATABASE

### Koneksi Database

| Parameter | Nilai |
|-----------|-------|
| Sistem | MySQL |
| Host | `127.0.0.1` |
| Port | `3306` |
| Nama Database | `yayasan_metland` |

### Tabel-Tabel Database (26 Migration Files)

| # | Tabel | Kolom Utama | Deskripsi |
|---|-------|-------------|-----------|
| 1 | `users` | name, email, password, role | User admin panel |
| 2 | `programs` | title, slug, description, image, category, stats, is_featured, order | Program/sekolah yayasan |
| 3 | `posts` | title, slug, body, excerpt, featured_image, category, is_published, is_important, author_name, author_photo, reading_time, published_at | Artikel/berita |
| 4 | `scholars` | name, country, flag, quote, photo, program, graduation_year, is_featured | Data penerima beasiswa |
| 5 | `partners` | name, logo, website_url, is_active | Mitra yayasan |
| 6 | `impact_stats` | value, suffix, label, description, icon | Statistik dampak |
| 7 | `team_members` | name, title, department, bio, photo, order, group, org_chart_node_id | Anggota tim/pengurus |
| 8 | `books` | title, author, description, cover_image, pdf_file, category, is_published | Buku digital |
| 9 | `banners` | title, image, order | Banner homepage |
| 10 | `hero_stats` | value, suffix, label, icon | Statistik hero section |
| 11 | `collection_stats` | key, value, label | Statistik koleksi |
| 12 | `org_chart_nodes` | name, title, parent_id, order | Node bagan organisasi |
| 13 | `page_contents` | page, key, value | Konten dinamis halaman |
| 14 | `activity_logs` | user_id, action, model_type, model_id, changes, ip_address, checksum, previous_checksum | Log audit admin |
| 15 | `personal_access_tokens` | — | Token API (Laravel Sanctum) |
| 16 | `cache`, `sessions`, `jobs`, `failed_jobs` | — | Tabel infrastruktur Laravel |

### Fitur Multi-Bahasa (Translatable)

Beberapa kolom database menggunakan format JSON untuk mendukung **bahasa Indonesia dan Inggris** secara bersamaan. Frontend menggunakan `i18next` dengan file terjemahan:
- `locales/id.json` (Bahasa Indonesia — default)
- `locales/en.json` (English)

Package yang digunakan: `spatie/laravel-translatable`

---

## 5. REST API ENDPOINTS

Semua endpoint publik berada di bawah prefix `/api/v1/` dengan rate limiting:

| Method | Endpoint | Deskripsi | Rate Limit |
|--------|----------|-----------|------------|
| GET | `/api/v1/programs` | Semua program aktif | 90/menit |
| GET | `/api/v1/programs/{slug}` | Detail program by slug | 90/menit |
| GET | `/api/v1/posts` | Daftar artikel (paginated, searchable, filterable) | 30/menit |
| GET | `/api/v1/posts/{slug}` | Detail artikel by slug | 90/menit |
| GET | `/api/v1/books` | Daftar buku (paginated, searchable) | 30/menit |
| GET | `/api/v1/books/{id}` | Detail buku by ID | 90/menit |
| GET | `/api/v1/impact-stats` | Statistik dampak | 90/menit |
| GET | `/api/v1/collection-stats` | Statistik koleksi literasi | 90/menit |
| GET | `/api/v1/hero-stats` | Statistik hero section | 90/menit |
| GET | `/api/v1/scholars` | Daftar penerima beasiswa | 90/menit |
| GET | `/api/v1/partners` | Daftar mitra | 90/menit |
| GET | `/api/v1/team` | Daftar tim/pengurus | 90/menit |
| GET | `/api/v1/banners` | Banner homepage | 90/menit |
| GET | `/api/v1/org-chart` | Bagan organisasi | 90/menit |
| GET | `/api/v1/page-contents/{page}` | Konten dinamis per halaman | 90/menit |

### Sistem Caching API

Setiap endpoint menggunakan **cache otomatis** yang akan di-invalidate secara otomatis ketika admin mengubah data melalui panel Filament. Ini memastikan:
- Performa API cepat (data di-cache)
- Data selalu fresh (cache otomatis di-clear saat ada perubahan)

---

## 6. TEKNOLOGI & LIBRARY YANG DIGUNAKAN

### Frontend

| Library | Versi | Fungsi |
|---------|-------|--------|
| **React** | 19.2.5 | Framework UI utama |
| **TypeScript** | ~6.0.2 | Type safety |
| **Vite** | 8.0.9 | Build tool & dev server |
| **TailwindCSS** | 3.4.19 | CSS utility framework |
| **Framer Motion** | 11.18.2 | Animasi deklaratif untuk React |
| **GSAP** | 3.15.0 | Animasi tingkat lanjut (hero section, scroll) |
| **React Router DOM** | 6.30.3 | Navigasi/routing halaman |
| **i18next** + **react-i18next** | 26.3.1 | Internationalisasi (multi-bahasa ID/EN) |
| **Lenis** | 1.3.23 | Smooth scrolling |
| **Lucide React** | 1.8.0 | Icon library |
| **Radix UI** | Various | Komponen UI accessible (Accordion, Dialog, Tabs, Tooltip, dll.) |
| **react-countup** | 6.5.3 | Animasi counter angka |
| **pdfjs-dist** | 4.10.38 | Render PDF untuk flipbook reader |
| **DOMPurify** | 3.4.11 | Sanitasi HTML (keamanan XSS) |
| **clsx** + **tailwind-merge** | Various | Utility class management |

### Backend

| Library | Versi | Fungsi |
|---------|-------|--------|
| **Laravel** | 13.0 | Framework PHP utama |
| **PHP** | ≥8.3 | Bahasa pemrograman server |
| **Filament** | 5.6 | Panel admin CRUD modern |
| **Laravel Sanctum** | 4.0 | Autentikasi API |
| **Intervention Image** | 4.0 | Manipulasi gambar (re-encode ke WebP) |
| **Spatie Translatable** | 6.14 | Konten multi-bahasa di database |

### Font yang Digunakan

| Font | Kegunaan |
|------|----------|
| **Inter** (Google Fonts) | Font sans-serif utama untuk body text |
| **Playfair Display** (Google Fonts) | Font serif untuk heading/judul |
| **Geist** (Google Fonts) | Font alternatif |

### Skema Warna

| Warna | Hex | Kegunaan |
|-------|-----|----------|
| Primary (Biru) | `#3D8ABF` | Warna utama brand |
| Secondary (Emas) | `#E5A320` | Aksen/highlight |
| Accent (Hijau) | `#10B981` | Indikator/badge |
| Charcoal | `#111111` | Background gelap |
| Off-white | `#FAFAF8` | Background terang |

---

## 7. STRUKTUR FOLDER PROJECT

```
Revisian_yayasan_literasi_metschoo-v2/
│
├── package.json                 # Root — script untuk menjalankan frontend + backend bersamaan
├── README.md                    # Dokumentasi ini
├── SECURITY_AUDIT.md            # Laporan audit keamanan lengkap
│
├── frontend/                    # FRONTEND (React + Vite)
│   ├── index.html               # Entry HTML utama
│   ├── package.json             # Dependencies frontend
│   ├── vite.config.ts           # Konfigurasi Vite (proxy API ke backend)
│   ├── tailwind.config.ts       # Konfigurasi TailwindCSS (warna, font, animasi)
│   ├── tsconfig.json            # Konfigurasi TypeScript
│   ├── postcss.config.js        # PostCSS config
│   │
│   └── src/
│       ├── main.tsx             # Entry point React + Lenis smooth scroll
│       ├── App.tsx              # Router utama — semua route didefinisikan di sini
│       ├── i18n.ts              # Konfigurasi multi-bahasa (i18next)
│       │
│       ├── pages/               # Halaman-halaman website (16 file)
│       │   ├── Home.tsx                 # Halaman utama (9 sections)
│       │   ├── VisiMisi.tsx             # Profil — Visi & Misi
│       │   ├── StrukturOrganisasi.tsx   # Profil — Struktur Organisasi
│       │   ├── OurSchool.tsx            # Daftar sekolah
│       │   ├── SchoolDetail.tsx         # Detail sekolah
│       │   ├── Artikel.tsx              # Daftar artikel/berita
│       │   ├── ArtikelDetail.tsx        # Detail artikel
│       │   ├── Literasi.tsx             # Perpustakaan digital + flipbook
│       │   ├── Contact.tsx              # Halaman kontak
│       │   ├── About.tsx                # (Legacy) Tentang
│       │   ├── Programs.tsx             # (Legacy) Program
│       │   ├── ProgramDetail.tsx        # (Legacy) Detail program
│       │   ├── Impact.tsx               # (Legacy) Dampak
│       │   ├── NewsIndex.tsx            # (Legacy) Berita
│       │   ├── NewsDetail.tsx           # (Legacy) Detail berita
│       │   └── NotFoundPage.tsx         # Halaman 404
│       │
│       ├── components/          # Komponen reusable
│       │   ├── sections/                # Section-section homepage
│       │   │   ├── HeroSection.tsx      # Hero banner (animasi GSAP)
│       │   │   ├── MarqueeStrip.tsx     # Teks berjalan
│       │   │   ├── NewsInsights.tsx     # Grid berita
│       │   │   ├── ImpactSpotlight.tsx  # Spotlight dampak
│       │   │   ├── WhatWeDo.tsx         # Apa yang kami lakukan
│       │   │   ├── ImpactNumbers.tsx    # Counter statistik
│       │   │   ├── ProgramsGrid.tsx     # Grid program
│       │   │   ├── PartnerLogos.tsx     # Logo partner
│       │   │   ├── CTABanner.tsx        # Call to Action
│       │   │   └── FlipbookReader.tsx   # Pembaca buku digital 3D
│       │   │
│       │   ├── layout/                  # Layout utama
│       │   │   ├── RootLayout.tsx       # Wrapper: Navbar + Content + Footer
│       │   │   ├── Navbar.tsx           # Navigation bar responsif
│       │   │   └── Footer.tsx           # Footer website
│       │   │
│       │   ├── ui/                      # Komponen UI kecil
│       │   │   ├── Button.tsx, Card.tsx, Badge.tsx, Divider.tsx
│       │   │   └── LoadingScreen.tsx    # Loading screen (lazy load)
│       │   │
│       │   └── animations/              # Wrapper animasi
│       │       └── PageTransition.tsx   # Animasi transisi antar halaman
│       │
│       ├── hooks/               # Custom React Hooks (16 hooks)
│       │   ├── useBanners.ts, useBooks.ts, useCollectionStats.ts
│       │   ├── useCursor.ts, useFlipbook.ts, useHeroStats.ts
│       │   ├── useImpactStats.ts, useNavScroll.ts, useOrgChart.ts
│       │   ├── usePageContent.ts, usePartners.ts, usePosts.ts
│       │   ├── usePrograms.ts, useReducedMotion.ts
│       │   ├── useScrollProgress.ts, useTeam.ts
│       │
│       ├── services/            # Service layer
│       │   └── api.ts                   # API client terpusat
│       │
│       ├── data/                # Data fallback/static
│       │   ├── programs.ts, posts.ts, scholars.ts, stats.ts, team.ts
│       │
│       ├── locales/             # File terjemahan
│       │   ├── id.json                  # Bahasa Indonesia
│       │   └── en.json                  # English
│       │
│       ├── types/               # TypeScript type definitions
│       │   └── index.ts
│       │
│       ├── styles/              # CSS Files
│       │   ├── globals.css              # Global CSS + Tailwind
│       │   ├── homepage-dark.css        # Dark theme homepage
│       │   └── book-animation.css       # Animasi 3D flipbook
│       │
│       ├── assets/              # Gambar & media
│       │   ├── logoyayasan.png, hero.png, *.webp, *.jpeg
│       │   ├── partners/                # Logo mitra
│       │   └── fonts/                   # Font lokal
│       │
│       └── lib/                 # Utility functions
│
├── backend/                     # BACKEND (Laravel 13)
│   ├── .env                     # Environment variables (lokal)
│   ├── .env.production.example  # Template env production
│   ├── composer.json            # Dependencies PHP
│   ├── artisan                  # Laravel CLI
│   │
│   ├── app/
│   │   ├── Models/              # Eloquent Models (16 model)
│   │   │   ├── User.php, Post.php, Book.php, Program.php
│   │   │   ├── Banner.php, HeroStat.php, ImpactStat.php
│   │   │   ├── CollectionStat.php, Partner.php, Scholar.php
│   │   │   ├── TeamMember.php, OrgChartNode.php, PageContent.php
│   │   │   ├── ProgramStat.php, PostTag.php, ActivityLog.php
│   │   │
│   │   ├── Http/
│   │   │   ├── Controllers/Api/        # REST API Controller
│   │   │   └── Middleware/             # SecurityHeaders, dll.
│   │   │
│   │   ├── Filament/Resources/         # Panel Admin (12+ resource)
│   │   │   ├── PostResource.php, BookResource.php
│   │   │   ├── Banners/, HeroStats/, HomeStats/
│   │   │   ├── HomePrograms/, Partners/, TeamMembers/
│   │   │   ├── OrgChartNodes/, PageContents/
│   │   │   ├── Users/, ActivityLogs/
│   │   │
│   │   ├── Policies/           # Authorization policies
│   │   ├── Providers/          # Service providers + cache invalidation
│   │   └── Support/            # Helper classes
│   │
│   ├── database/
│   │   ├── migrations/         # 26 file migrasi database
│   │   ├── seeders/            # 6 seeder untuk data awal
│   │   └── database.sqlite     # SQLite (backup/alternatif)
│   │
│   ├── routes/
│   │   ├── api.php             # Semua route API publik
│   │   ├── web.php             # Route web (admin + download buku)
│   │   └── console.php         # Artisan commands
│   │
│   ├── config/                 # Konfigurasi Laravel (13 file)
│   ├── public/                 # Document root server
│   ├── storage/                # Upload files, cache, logs
│   └── tests/                  # PHPUnit tests
│
└── docs/                        # DOKUMENTASI
    └── SECURITY_DEPLOYMENT.md   # Panduan deployment & keamanan
```

---

## 8. PANDUAN INSTALASI — LANGKAH DEMI LANGKAH

### Prasyarat yang Harus Diinstal di Laptop

Pastikan semua software berikut sudah terinstal sebelum memulai:

| # | Software | Versi Minimum | Download |
|---|----------|---------------|----------|
| 1 | **Laragon** (RECOMMENDED) atau XAMPP | Terbaru | [laragon.org](https://laragon.org/download) |
| 2 | **PHP** | ≥ 8.3 | Sudah termasuk di Laragon |
| 3 | **MySQL/MariaDB** | ≥ 8.0 / 10.x | Sudah termasuk di Laragon |
| 4 | **Composer** | ≥ 2.x | Sudah termasuk di Laragon, atau [getcomposer.org](https://getcomposer.org) |
| 5 | **Node.js** | ≥ 18.x (rekomendasi 20+) | [nodejs.org](https://nodejs.org) |
| 6 | **npm** | ≥ 9.x | Sudah termasuk di Node.js |
| 7 | **Git** | Terbaru | [git-scm.com](https://git-scm.com) |

### Langkah 1 — Clone/Download Project

```bash
# Jika menggunakan Git:
cd C:\laragon\www
git clone <URL_REPOSITORY> Revisian_yayasan_literasi_metschoo-v2

# Atau jika dibagikan sebagai file ZIP:
# Ekstrak file ZIP ke C:\laragon\www\Revisian_yayasan_literasi_metschoo-v2
```

### Langkah 2 — Setup Database MySQL

1. **Buka Laragon** → Start All Services
2. **Buka HeidiSQL** (dari menu Laragon → Database) atau phpMyAdmin
3. **Buat database baru:**

```sql
CREATE DATABASE yayasan_metland CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. **(Opsional)** Buat user database khusus:

```sql
CREATE USER 'metland_db_user'@'localhost' IDENTIFIED BY 'password_anda_sendiri';
GRANT ALL PRIVILEGES ON yayasan_metland.* TO 'metland_db_user'@'localhost';
FLUSH PRIVILEGES;
```

### Langkah 3 — Setup Backend (Laravel)

```bash
# Masuk ke folder backend
cd C:\laragon\www\Revisian_yayasan_literasi_metschoo-v2\backend

# 1. Install dependencies PHP
composer install

# 2. Copy file environment (jika belum ada)
# File .env sudah ada di project, tapi jika perlu reset:
# copy .env.production.example .env

# 3. EDIT file .env — sesuaikan konfigurasi database:
# Buka file backend\.env dengan text editor, pastikan:
#   DB_CONNECTION=mysql
#   DB_HOST=127.0.0.1
#   DB_PORT=3306
#   DB_DATABASE=yayasan_metland
#   DB_USERNAME=root            ← sesuaikan dengan user MySQL Anda
#   DB_PASSWORD=                ← sesuaikan (kosong jika Laragon default)

# 4. Generate application key (jika belum ada)
php artisan key:generate

# 5. Jalankan migrasi database (membuat semua tabel)
php artisan migrate

# 6. (Opsional) Jalankan seeder untuk mengisi data awal
php artisan db:seed

# 7. Buat symbolic link untuk storage (agar file upload bisa diakses)
php artisan storage:link

# 8. Clear cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### Langkah 4 — Setup Frontend (React)

```bash
# Masuk ke folder frontend
cd C:\laragon\www\Revisian_yayasan_literasi_metschoo-v2\frontend

# Install dependencies Node.js
npm install
```

### Langkah 5 — Install Root Dependencies

```bash
# Kembali ke root project
cd C:\laragon\www\Revisian_yayasan_literasi_metschoo-v2

# Install root dependencies (concurrently — untuk menjalankan 2 server sekaligus)
npm install
```

### Langkah 6 — Jalankan Project!

#### Opsi A: Jalankan Bersamaan (Recommended)

```bash
cd C:\laragon\www\Revisian_yayasan_literasi_metschoo-v2
npm run dev
```

Perintah ini akan menjalankan **dua server sekaligus**:
- **Backend Laravel** di `http://localhost:8000`
- **Frontend React** di `http://localhost:5173` (otomatis terbuka di browser)

#### Opsi B: Jalankan Terpisah (2 Terminal)

**Terminal 1 — Backend:**
```bash
cd C:\laragon\www\Revisian_yayasan_literasi_metschoo-v2\backend
php artisan serve
```

**Terminal 2 — Frontend:**
```bash
cd C:\laragon\www\Revisian_yayasan_literasi_metschoo-v2\frontend
npm run dev
```

### Langkah 7 — Buat Akun Admin Pertama

```bash
cd C:\laragon\www\Revisian_yayasan_literasi_metschoo-v2\backend

# Buat user admin melalui Tinker
php artisan tinker
```

Di dalam Tinker, ketik:

```php
\App\Models\User::create([
    'name' => 'Super Admin',
    'email' => 'admin@yayasanmetland.com',
    'password' => bcrypt('password_admin_anda'),
    'role' => 'super_admin',
]);
```

Lalu ketik `exit` untuk keluar dari Tinker.

### Langkah 8 — Akses Website

| URL | Kegunaan |
|-----|----------|
| `http://localhost:5173` | **Website publik** — halaman yang dilihat pengunjung |
| `http://localhost:8000/admin` | **Panel Admin** — login dengan akun yang baru dibuat |

---

## 9. CARA KERJA PROXY (FRONTEND → BACKEND)

Frontend (Vite) dikonfigurasi dengan **proxy** sehingga semua request ke `/api/*` dan `/storage/*` otomatis diteruskan ke backend Laravel:

```
Browser (localhost:5173)
   │
   ├── /api/v1/posts  ──→ Proxy ke localhost:8000/api/v1/posts
   ├── /storage/...   ──→ Proxy ke localhost:8000/storage/...
   └── /other-pages   ──→ Ditangani React Router
```

Artinya: **Pengunjung hanya perlu membuka satu URL** (`localhost:5173`), dan semua data otomatis diambil dari backend.

---

## 10. KEAMANAN YANG SUDAH DITERAPKAN

Project ini sudah melewati **security audit menyeluruh** (skor ~8.7/10). Beberapa kontrol keamanan:

| Aspek | Implementasi |
|-------|-------------|
| **XSS Prevention** | DOMPurify pada frontend, HTML sanitization |
| **CSRF Protection** | Laravel Sanctum |
| **SQL Injection** | Eloquent ORM (parameterized queries) |
| **File Upload** | Re-encode gambar ke WebP, PDF ke private storage, MIME validation |
| **Security Headers** | X-Content-Type-Options, X-Frame-Options, CSP, Referrer-Policy |
| **Rate Limiting** | 30-90 req/menit per IP untuk API publik, 10 req/menit untuk login |
| **Role-Based Access** | Policy-based authorization (super_admin vs admin_konten) |
| **Audit Trail** | Activity logging dengan checksum chain (tamper-evident) |
| **Password Policy** | Min 12 karakter, mixed case, angka, simbol, breach check |
| **Session Security** | Secure cookie, encrypted session, 2-hour timeout (production) |

> Untuk detail lengkap, baca file `SECURITY_AUDIT.md` di root project.

---

## 11. TROUBLESHOOTING UMUM

| Masalah | Solusi |
|---------|--------|
| **Halaman frontend blank / data tidak muncul** | Pastikan backend Laravel sudah berjalan di port 8000 |
| **Data kosong di website** | 1) Cek database sudah di-migrate. 2) Cek `.env` koneksi DB. 3) Jalankan `php artisan db:seed` untuk data awal |
| **Error "SQLSTATE" saat migrate** | Database `yayasan_metland` belum dibuat — buat dulu di MySQL |
| **Port 8000 sudah dipakai** | Ganti port: `php artisan serve --port=8001` dan update proxy di `vite.config.ts` |
| **npm install error** | Hapus `node_modules` dan `package-lock.json`, lalu `npm install` ulang |
| **Gambar tidak muncul** | Jalankan `php artisan storage:link` |
| **Admin panel tidak bisa login** | Pastikan sudah membuat user via Tinker (Langkah 7) |
| **composer install gagal** | Pastikan PHP ≥ 8.3 dan extension `mbstring`, `xml`, `curl`, `gd`, `zip` aktif |

---

## 12. RINGKASAN UKURAN PROJECT

| Komponen | Detail |
|----------|--------|
| Halaman Frontend | 16 halaman |
| Komponen React | ~25 komponen |
| Custom Hooks | 16 hooks |
| Models Backend | 16 model |
| Filament Resources | 12+ modul admin |
| Database Migrations | 26 file migrasi |
| Database Seeders | 6 seeder |
| API Endpoints | 15 endpoint |
| File Terjemahan | 2 bahasa (ID, EN) |
| Security Audit Score | ~8.7/10 |

---

## Lisensi & Catatan

- Framework Laravel berlisensi [MIT License](https://opensource.org/licenses/MIT)
- Untuk panduan deployment production, baca `docs/SECURITY_DEPLOYMENT.md`
- Untuk laporan keamanan, baca `SECURITY_AUDIT.md`

---

> **Dibuat dengan dedikasi untuk Yayasan Pendidikan Metland**
