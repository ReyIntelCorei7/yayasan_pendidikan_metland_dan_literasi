# Prompt Implementasi Fitur Perpustakaan Digital (Ebook / HTML5 Flipbook)
## Proyek: Yayasan Pendidikan Metland & Literasi
## VERSI DIPERBARUI — Menyesuaikan dengan file Literasi.tsx yang sudah ada

---

## KONTEKS PROYEK

Proyek ini adalah website Yayasan Pendidikan Metland yang terdiri dari:
- **Frontend**: React + Vite + TypeScript + TailwindCSS
  - Lokasi: `c:\laragon\www\foundation-frontend\src\`
  - Library animasi: `framer-motion` sudah terinstall
  - Komponen animasi custom: `ScrollReveal` di `src/components/animations/ScrollReveal.tsx`, `CountUpTrigger` di `src/components/animations/CountUpTrigger.tsx`
- **Backend**: Laravel + Filament Admin Panel
  - Lokasi: `c:\laragon\www\foundation-frontend\backend\`
  - API Controller sudah ada: `backend/app/Http/Controllers/Api/ApiController.php`
  - Routes API sudah ada: `backend/routes/api.php` dengan prefix `v1`
  - Resource Filament sudah ada: `ScholarResource`, dll
- **Komunikasi**: Vite proxy sudah diatur di `vite.config.ts` → `/api/*` diteruskan ke `http://localhost:8000`
- **API Service Frontend**: `src/services/api.ts`

---

## PALET WARNA & DESAIN YANG SUDAH ADA (WAJIB KONSISTEN)

Halaman `Literasi.tsx` sudah menggunakan sistem warna berikut — **JANGAN UBAH ini, sesuaikan section baru dengan palet ini**:
- Background utama: `#FFFFFF` (putih)
- Background gelap: `#1C1C1C` (hampir hitam)
- Background krem: `#F5F0E8`
- Background aksen: `bg-lime` (warna hijau-kuning, class Tailwind custom)
- Teks gelap: `#1C1C1C`
- Teks aksen: `text-lime`
- Teks sekunder: `text-gray-400`, `text-gray-500`
- Font: sans-serif system font, font-black untuk headline besar
- Letter spacing headline: `-2px` sampai `-4px`
- Line height headline: `0.95` sampai `1.05`

---

## STRUKTUR HALAMAN LITERASI.TSX SAAT INI

File `src/pages/Literasi.tsx` saat ini memiliki 7 section:
1. **HERO** — fullscreen, typographic, "Membangun Budaya Membaca."
2. **STRIP STATISTIK** — background hitam, 4 angka statistik (CountUp)
3. **TENTANG LITERASI** — 2 kolom, kiri teks, kanan gambar perpustakaan
4. **KOLEKSI PERPUSTAKAAN** — background krem `#F5F0E8`, 4 kartu koleksi (CountUp per kartu)
5. **PROGRAM LITERASI** — background hitam, list program (Pojok Baca, Klub Literasi, dll)
6. **E-LIBRARY FEATURE** — background lime, teks kiri + grid cover buku kanan (GAMBAR PLACEHOLDER)
7. **CTA PENUTUP** — background hitam, "Bergabung dalam Gerakan Literasi"

---

## PERUBAHAN YANG DIMINTA

### APA YANG PERLU DIUBAH / DITAMBAH:

**Section 6 (E-LIBRARY FEATURE) — MODIFIKASI UTAMA:**
Section ini saat ini hanya menampilkan 6 gambar cover statis dari Unsplash sebagai placeholder di sisi kanan. Ganti keseluruhan section ini menjadi **Section Perpustakaan Digital** yang menampilkan buku-buku nyata dari database backend:
- **Kiri**: Pertahankan teks "5.000+ E-Book Tersedia" dan tombol "Akses E-Library", tapi ubah tombol agar berfungsi sebagai anchor ke grid buku di bawahnya
- **Kanan**: Ganti grid gambar placeholder menjadi **3 kartu buku terbaru** yang diambil dari API. Setiap kartu menampilkan:
  - Cover buku (gambar, aspek ratio 3:4)
  - Judul buku
  - Nama penulis
  - Tombol "Baca" yang membuka Flipbook Reader

**Section Baru (disisipkan ANTARA section 6 dan 7 / CTA) — TAMBAHKAN:**
Tambahkan section baru bernama **"Koleksi Buku Digital"** dengan:
- Background putih (`bg-white`)
- Judul besar: "Buku Digital Kami" atau "Koleksi E-Book"
- Filter kategori horizontal (tombol pill/badge): Semua | Pendidikan | Literasi | Sains | Fiksi | Agama | Umum
- Grid buku: **2 kolom di mobile, 3 kolom di tablet, 4 kolom di desktop**
- Setiap kartu buku berisi:
  - Cover buku (gambar besar, aspek ratio `3/4`, dengan hover scale effect)
  - Badge kategori (warna berbeda per kategori)
  - Judul buku (font-semibold, 1-2 baris maksimum)
  - Nama penulis (text-gray-500 text-sm)
  - Tombol "Baca Sekarang" → membuka Flipbook Reader modal
- Status loading: tampilkan skeleton cards saat data diambil
- Status kosong: tampilkan pesan "Belum ada buku tersedia" yang didesain dengan baik
- Data diambil dari API: `GET /api/v1/books`

---

## IMPLEMENTASI BACKEND

### 1. Migration — Buat file baru di `backend/database/migrations/`
```
create_books_table
```
Kolom:
- `id` (bigIncrements)
- `title` (string)
- `author` (string)
- `description` (text, nullable)
- `cover_image` (string, nullable) — path relatif di storage
- `pdf_file` (string) — path relatif di storage
- `category` (string, default: 'Umum') — nilai: Pendidikan, Literasi, Sains, Fiksi, Agama, Umum
- `is_published` (boolean, default: false)
- `order` (integer, default: 0)
- `timestamps`

### 2. Model — Buat `backend/app/Models/Book.php`
```php
protected $fillable = ['title', 'author', 'description', 'cover_image', 'pdf_file', 'category', 'is_published', 'order'];

public function scopePublished($query) {
    return $query->where('is_published', true);
}
```

### 3. Filament Resource — Buat `backend/app/Filament/Resources/BookResource.php`
Form fields (urutan tampil di form Filament):
- `Section('Informasi Buku')` berisi:
  - `TextInput::make('title')` — required
  - `TextInput::make('author')` — required
  - `Textarea::make('description')`
  - `Select::make('category')` — options: Pendidikan, Literasi, Sains, Fiksi, Agama, Umum
- `Section('File & Media')` berisi:
  - `FileUpload::make('cover_image')` — acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp'], directory: 'covers', disk: 'public'
  - `FileUpload::make('pdf_file')` — acceptedFileTypes: ['application/pdf'], directory: 'books', disk: 'public', required
- `Section('Pengaturan')` berisi:
  - `Toggle::make('is_published')` — label: 'Publikasikan Buku'
  - `TextInput::make('order')` — numeric, default: 0

Table columns: title, author, category, badge is_published (green=published, gray=draft), created_at
Table filters: SelectFilter category, TernaryFilter is_published

### 4. API Endpoint — Modifikasi `backend/routes/api.php`
Tambahkan di dalam `Route::prefix('v1')`:
```php
Route::get('/books', [ApiController::class, 'books']);
Route::get('/books/{id}', [ApiController::class, 'bookById']);
```

### 5. ApiController — Tambahkan method di `backend/app/Http/Controllers/Api/ApiController.php`
```php
public function books(): JsonResponse
{
    $books = Book::published()
        ->orderBy('order')
        ->get()
        ->map(fn ($b) => [
            'id' => (string) $b->id,
            'title' => $b->title,
            'author' => $b->author,
            'description' => $b->description,
            'category' => $b->category,
            'coverImage' => $b->cover_image ? asset('storage/' . $b->cover_image) : null,
            'pdfUrl' => asset('storage/' . $b->pdf_file),
            'order' => $b->order,
        ]);

    return response()->json($books);
}

public function bookById(string $id): JsonResponse
{
    $book = Book::published()->findOrFail($id);

    return response()->json([
        'id' => (string) $book->id,
        'title' => $book->title,
        'author' => $book->author,
        'description' => $book->description,
        'category' => $book->category,
        'coverImage' => $book->cover_image ? asset('storage/' . $book->cover_image) : null,
        'pdfUrl' => asset('storage/' . $book->pdf_file),
        'order' => $book->order,
    ]);
}
```

---

## IMPLEMENTASI FRONTEND

### 1. Install Library
```bash
npm install react-pdf
npm install @types/react-pdf
```
Gunakan `react-pdf` (yang berbasis PDF.js) untuk merender halaman PDF.
Gunakan CSS `overflow: hidden` + efek transformasi CSS 3D untuk efek page-flip sederhana.
JANGAN gunakan jQuery atau library lama. Gunakan pure React.

### 2. Tambah di `src/services/api.ts`
```typescript
books: {
  list: () => fetchApi<any[]>('/books'),
  byId: (id: string) => fetchApi<any>(`/books/${id}`),
},
```

### 3. Buat Custom Hook `src/hooks/useBooks.ts`
Hook ini mengelola:
- State `books: Book[]`
- State `loading: boolean`
- State `error: string | null`
- State `activeCategory: string` (untuk filter)
- Computed value `filteredBooks` berdasarkan activeCategory
- Pemanggilan `api.books.list()` di dalam `useEffect`
- Fallback: jika API error, log error ke console, tampilkan array kosong

Tipe `Book`:
```typescript
interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  category: string;
  coverImage?: string;
  pdfUrl: string;
  order: number;
}
```

### 4. Buat Komponen `src/components/sections/FlipbookReader.tsx`
Komponen modal fullscreen untuk membaca PDF sebagai flipbook:
- **Props**: `{ book: Book; onClose: () => void }`
- Background overlay: hitam semi-transparan `bg-black/90`
- Tampilan buku:
  - Desktop (lebar > 768px): tampilkan 2 halaman berdampingan (left page + right page)
  - Mobile: tampilkan 1 halaman saja
- Efek page-flip: gunakan CSS `transform: rotateY()` dengan `perspective: 2000px` untuk animasi balik halaman
- Navigasi:
  - Tombol `◀ Prev` dan `Next ▶` di bawah buku
  - Indikator halaman: `Halaman 3 / 24`
  - Keyboard: panah kiri/kanan untuk navigasi
- Header bar (atas): judul buku di tengah + tombol Close (✕) di kanan + tombol Download di kiri
- Warna tema reader: background `#1C1C1C`, halaman buku `#FFFFF0` (cream), teks navigasi putih, tombol navigasi aksen `lime`
- Loading state: tampilkan spinner saat PDF pertama kali dimuat
- Gunakan `pdfjs-dist` (terinstall bersama `react-pdf`) untuk merender tiap halaman PDF menjadi `<canvas>`

### 5. Modifikasi `src/pages/Literasi.tsx`

**Import yang perlu ditambahkan:**
```typescript
import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import useBooks from '../hooks/useBooks';
import FlipbookReader from '../components/sections/FlipbookReader';
```

**State baru di dalam component:**
```typescript
const { books, loading, activeCategory, setActiveCategory, filteredBooks } = useBooks();
const [selectedBook, setSelectedBook] = useState<Book | null>(null);
```

**Perubahan pada Section 6 (E-LIBRARY FEATURE, background lime):**
- Pertahankan layout 2 kolom
- Kiri: pertahankan teks dan ubah href tombol "Akses E-Library" menjadi `#koleksi-buku`
- Kanan: GANTI grid gambar placeholder dengan 3 kartu buku terbaru dari `books.slice(0, 3)`:
  - Jika loading: tampilkan 3 skeleton cards dengan background `#C8E000/30` (lime muda)
  - Jika ada data: tampilkan kartu buku dengan cover, judul, dan tombol "Baca"
  - Setiap kartu buku mempunyai hover effect dan tombol "Baca" yang menjalankan `setSelectedBook(book)`

**Section Baru (tambahkan setelah Section 6, sebelum Section 7 CTA):**
```
id="koleksi-buku"
background: bg-white
padding: py-24 lg:py-32
```

Struktur section baru:
1. Header section:
   - Label kecil: `text-lime uppercase tracking-[3px] text-xs font-semibold` → "Perpustakaan Digital"
   - Judul besar: `font-bold text-[#1C1C1C]` style `fontSize: clamp(36px,6vw,72px), letterSpacing: -2px, lineHeight: 1.05` → "Koleksi Buku Digital"
   - Bungkus dengan `<ScrollReveal>`

2. Filter Kategori:
   - Tombol pill horizontal, dengan `gap-3 flex flex-wrap`
   - Kategori: ['Semua', 'Pendidikan', 'Literasi', 'Sains', 'Fiksi', 'Agama', 'Umum']
   - Active state: `bg-[#1C1C1C] text-white`
   - Inactive state: `border border-gray-300 text-gray-500 hover:border-[#1C1C1C] hover:text-[#1C1C1C]`
   - Padding: `px-5 py-2 text-sm font-medium transition-all duration-200`

3. Grid Buku:
   - `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10`
   - Loading state: 8 skeleton cards dengan `animate-pulse bg-gray-100`
   - Empty state: centered message dengan icon buku dan teks "Belum ada buku tersedia"
   - Setiap kartu buku:
     ```
     <motion.div whileHover={{ y: -4 }} className="group cursor-pointer">
       <div className="overflow-hidden mb-3" style={{ aspectRatio: '3/4' }}>
         <img src={book.coverImage || placeholder} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }} />
       </div>
       <span className="text-xs font-semibold px-2 py-0.5 bg-lime text-[#1C1C1C]">{book.category}</span>
       <h3 className="font-semibold text-[#1C1C1C] text-sm mt-2 line-clamp-2">{book.title}</h3>
       <p className="text-gray-400 text-xs mt-1">{book.author}</p>
       <button onClick={() => setSelectedBook(book)}
               className="mt-3 w-full flex items-center justify-center gap-2 border border-[#1C1C1C] text-[#1C1C1C] text-xs font-medium py-2 hover:bg-[#1C1C1C] hover:text-white transition-all duration-300">
         <BookOpen className="w-3.5 h-3.5" /> Baca Sekarang
       </button>
     </motion.div>
     ```

4. Render Flipbook Reader (di akhir return, di dalam Fragment):
   ```typescript
   {selectedBook && (
     <FlipbookReader book={selectedBook} onClose={() => setSelectedBook(null)} />
   )}
   ```

---

## PLACEHOLDER COVER BUKU
Jika buku tidak memiliki cover image, gunakan placeholder:
`https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80`
(gambar buku dari Unsplash yang sudah digunakan di halaman ini)

---

## URUTAN IMPLEMENTASI

1. **Backend — Migration**: Buat dan jalankan migration tabel `books`
2. **Backend — Model**: Buat `Book.php` dengan scope `published()`
3. **Backend — Filament**: Buat `BookResource.php`
4. **Backend — API**: Tambah method `books()` dan `bookById()` di `ApiController.php`
5. **Backend — Routes**: Tambah 2 route baru di `routes/api.php`
6. **Backend — Storage Link**: Jalankan `php artisan storage:link` di folder `backend/`
7. **Backend — Migrate**: Jalankan `php artisan migrate` di folder `backend/`
8. **Frontend — API Service**: Tambah `books` di `src/services/api.ts`
9. **Frontend — Hook**: Buat `src/hooks/useBooks.ts`
10. **Frontend — Library**: Install `react-pdf`
11. **Frontend — Reader**: Buat `src/components/sections/FlipbookReader.tsx`
12. **Frontend — Halaman**: Modifikasi `src/pages/Literasi.tsx` (Section 6 + Section baru)
13. **Testing**: Upload 2-3 buku sample PDF melalui Filament Admin, verifikasi tampil di frontend

---

## CATATAN TEKNIS PENTING

- **PDF.js Worker**: Tambahkan konfigurasi ini di komponen FlipbookReader:
  ```typescript
  import { pdfjs } from 'react-pdf';
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  ```
- **CORS**: Backend sudah menggunakan `HandleCors::class`, tidak perlu konfigurasi tambahan
- **Ukuran Upload**: Pastikan `upload_max_filesize = 50M` dan `post_max_size = 50M` di PHP (Laragon biasanya bisa diatur dari menu PHP → php.ini)
- **Storage Disk**: Gunakan disk `public` untuk semua upload agar bisa diakses lewat URL
- **Animasi**: Gunakan komponen `<ScrollReveal>` yang sudah ada untuk section baru, dan `motion.div whileHover` untuk kartu buku, konsisten dengan section lain di halaman ini
