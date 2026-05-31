# IPB Reserve - Clean Architecture

Sistem Reservasi Fasilitas Kampus IPB. Project ini dibagi menjadi dua bagian utama: Frontend (React) and Backend (FastAPI).

## Struktur Folder

```text
.
├── frontend/             # React application (Vite)
│   ├── src/              # Logic frontend
│   └── public/           # Static assets
├── backend/              # FastAPI application
│   └── src/
│       ├── controllers/  # Logic tambahan (opsional)
│       ├── routes/       # Endpoint API (FastAPI Routers)
│       ├── models/       # Entity and ORM models
│       ├── services/     # Business logic
│       └── database/     # Konfigurasi database
└── docs/                 # Dokumentasi (openapi.json)
```

## Cara Menjalankan

### 1. Menjalankan Backend
Pastikan Python sudah terinstal di laptop Anda.

1. **Masuk ke folder backend & buat virtual environment:**
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate  # Untuk Windows: .venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Konfigurasi Environment (.env):**
   Salin file `.env.example` menjadi `.env` (atau langsung edit file `.env` yang sudah ada):
   - Masukkan koneksi string database PostgreSQL (dari Railway/Supabase) pada variabel `DATABASE_URL`.
   - Atur konfigurasi Firebase Auth pada `FIREBASE_CREDENTIALS`.

4. **Seed database awal:**
   Jalankan file seeder untuk membuat tabel dan mengisi data fasilitas kampus awal ke PostgreSQL:
   ```bash
   python3 seed.py
   ```

5. **Jalankan server FastAPI:**
   ```bash
   uvicorn src.main:app --reload
   ```
   API akan berjalan di `http://localhost:8000`.

### 2. Menjalankan Frontend

1. **Masuk ke folder frontend & install packages:**
   ```bash
   cd frontend
   npm install
   ```

2. **Jalankan development server React:**
   ```bash
   npm run dev
   ```
   Frontend akan berjalan di `http://localhost:5173`. Semua request ke `/api` akan otomatis di-proxy ke backend.

## Integrasi
Koneksi antara frontend dan backend dikelola melalui Vite proxy di `frontend/vite.config.js`. Gunakan `/api/facilities` atau `/api/reservations` di frontend untuk mengakses data dari backend.