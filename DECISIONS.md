# Project Decisions & Ad-Hoc Conventions

Dokumen ini digunakan untuk mencatat keputusan teknis, kesepakatan desain, atau konvensi ad-hoc baru yang ditemukan selama proses pengembangan **OWW UIKit Design System** sebelum dipromosikan ke `AGENT.md`.

---

## 1. Icon System & Copy Snippet
- Semua tombol copy code snippet pada dokumentasi menggunakan format **icon-only** tanpa teks label `Copy` dengan dimensi `14x14` dan icon standard SVG.
- Setiap elemen interaktif icon-only wajib menyertakan `aria-label` dan `title` untuk aksesibilitas (WCAG AA).

## 2. Theme Toggle & State Persistence
- Preferensi tema disimpan di `localStorage` dengan key `oww-theme`.
- Inisialisasi tema dilakukan langsung melalui script utama `src/js/main.js` untuk menjaga kebersihan markup HTML (zero inline script).
- State icon tombol tema:
  - Dark Mode: Menampilkan icon Matahari (Sun) untuk beralih ke Light Mode.
  - Light Mode: Menampilkan icon Bulan (Moon) untuk beralih ke Dark Mode.

## 3. Component Sidebar Navigation
- Komponen sidebar wajib selalu diurutkan secara alfabetis (A-Z).
- Item komponen yang belum diimplementasikan diberi label badge `Soon` dan tautan dinonaktifkan sementara.
- Halaman aktif wajib menyertakan class `.is-active`.

## 4. hilangkan info mengenai hasil perbaikan atau ketidaksesauian dan implementasi
- 

*Catatan: Keputusan yang terbukti stabil dan berlaku secara permanen di seluruh komponen dapat dipromosikan ke `AGENT.md` oleh pengguna.*
