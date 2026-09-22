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
## 5. sesuaikan dengan style figma, dengan background putih, style component harusnya tidak terpengaruh oleh tema dari preview docs dark mode dan light mode, stick ke figma yg putih

*Catatan: Keputusan yang terbukti stabil dan berlaku secara permanen di seluruh komponen dapat dipromosikan ke `AGENT.md` oleh pengguna.*

## 6. Dynamic Theme Adaptation for Component Code Snippets & Copy
- Code snippet box pada dokumentasi secara dinamis menyesuaikan attribute `data-theme="dark"` atau `data-theme="light"` dengan tema aktif yang sedang dipilih pengguna (light/dark mode toggle).
- Logika JavaScript `copyCode` secara otomatis menyematkan / memperbarui `data-theme` sesuai mode tema aktif saat ini pada elemen root komponen yang disalin ke clipboard.
- Seluruh komponen SCSS (`_file-upload.scss`, `_card.scss`, `_dropdown.scss`, `_input.scss`, `_radio.scss`, `_range.scss`, `_sidebar.scss`, `_stepper.scss`) mendukung selector eksplisit untuk `[data-theme="dark"]` dan `[data-theme="light"]`, baik disematkan pada parent container (`[data-theme="..."] .oww-...`) maupun langsung pada root komponen (`.oww-...[data-theme="..."]`).
