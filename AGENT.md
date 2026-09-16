# Aturan Ketat Perilaku AI (Agent Instructions)

Dokumen ini mendefinisikan aturan ketat yang wajib dipatuhi oleh seluruh AI agent / model saat membaca, memodifikasi, menggenerasi, atau memperluas kode pada **OWW UIKit Design System**.

---

## 1. Zero Hardcoded Values (Prinsip Tokenisasi)
1. **Dilarang keras melakukan hardcode** pada nilai warna (hex, rgb, hsl), spacing (padding/margin), ukuran font, border radius, atau box shadow langsung di level komponen.
2. Semua nilai styling harus merujuk ke token yang didefinisikan di:
   - `src/scss/abstract/_variables.scss`
   - atau melalui fungsi konversi di `src/scss/abstract/_functions.scss` (contoh: `rem(14px)`).
3. Jika sebuah token desain baru ditemukan di Figma (misalnya warna varian baru atau radius khusus), **wajib** mendaftarkan token tersebut ke `_variables.scss` terlebih dahulu dengan flag `!default`.

---

## 2. Arsitektur Sass & Pemisahan Tanggung Jawab
1. Ikuti arsitektur modular Sass:
   - `abstract/`: Hanya berisi kode deklaratif yang tidak menghasilkan output CSS secara langsung (variables, functions, mixins).
   - `base/`: Berisi CSS reset, typography global, dan normalisasi dasar HTML.
   - `components/`: Berisi styling komponen terisolasi (misal: alert, button, card).
2. Hindari dependensi sirkular antar file SCSS.
3. Selalu gunakan fitur modern Sass (`@use`, `@forward`) dan hindari `@import` yang sudah berstatus *deprecated*.
4. Setiap token di `_variables.scss` **wajib** menyertakan flag `!default` agar dapat di-override oleh consumer design system.

---

## 3. Kesesuaian Desain Figma (Figma High Fidelity)
1. Setiap komponen yang diimplementasikan dari Figma harus merefleksikan spesifikasi Figma secara akurat:
   - Layout auto-layout (direction, alignment, gap, padding).
   - Tipografi (font-family, font-size, font-weight, line-height, letter-spacing).
   - Warna (fill, stroke, opacity).
   - Shadow / effects.
2. Penamaan komponen dan varian harus selaras dengan penamaan di Figma (contoh: `Variant=Success`, `Variant=Warning`).

---

## 4. Standar Penamaan & Konvensi CSS
1. Gunakan metodologi penamaan yang konsisten dan terprediksi (misalnya BEM: `Block__Element--Modifier`) dengan prefix standar proyek (contoh: `oww-` atau `uikit-`).
   * Contoh: `.oww-alert`, `.oww-alert__icon`, `.oww-alert--success`.
2. Jangan menggunakan selector universal (`*`) atau selector tag mentah di dalam styling komponen untuk menghindari kebocoran style (*style pollution*).
3. Batasi kedalaman nesting maksimal **3 tingkat** untuk menjaga spesifisitas tetap rendah.

---

## 5. Aksesibilitas & Performa (a11y & Performance)
1. Setiap elemen interaktif (button, input, link) **wajib** memiliki state `:focus-visible` yang jelas menggunakan mixin `@include focus-ring`.
2. Pastikan rasio kontras teks dan background memenuhi standar **WCAG AA** (minimal 4.5:1 untuk teks normal).
3. Hindari animasi yang memicu layout re-flow (hindari menganimasikan `width`, `height`, `top`, `left`). Gunakan `transform` dan `opacity`.

---

## 6. Prosedur Verifikasi
1. Setiap kali melakukan perubahan atau penambahan SCSS:
   - Jalankan script build Sass (`npm run build:css`) untuk memastikan tidak ada syntax error atau deprecation warning.
   - Pastikan file output CSS di `dist/` ter-compile dengan valid dan bersih.

---

## 7. Bahasa Dokumentasi & Preview HTML (Documentation & Preview Rules)
1. **Bahasa Inggris Penuh**: Seluruh teks konten, deskripsi, heading, tabel, tooltip, placeholder, dan komentar kode di semua file HTML preview (`index.html`, `alert.html`, `avatar.html`, `icons.html`, dll) **wajib menggunakan Bahasa Inggris (English)**.
2. **Tanpa Nomor / Node ID Figma**: Dilarang keras menampilkan angka yang merujuk pada nomor komponen / node ID Figma (contoh: `#22451:417`, `#22847:16374`, `22517:4042`) di dalam teks preview HTML. Gunakan penamaan semantik yang bersih (contoh: `Avatar Component Set`, `Initials Avatar`). Aturan ini berlaku seterusnya untuk semua komponen.
3. **Urutan Abjad Komponen Sidebar (A-Z Alphabetical Order)**: Daftar komponen pada sidebar kiri dokumentasi (`.doc-sidebar__list` pada grup Components) **wajib selalu diurutkan sesuai abjad dari A sampai Z** (contoh: Alert, Avatar, Badge, Button, Card, Icons & Flags, Input & Forms, Modal). Setiap penambahan komponen baru di masa mendatang harus disisipkan sesuai urutan abjad ini secara konsisten di semua halaman preview HTML.
4. **Struktur Navigasi Atas (Top Navbar Links)**: Navigasi atas (`.doc-navbar__nav`) hanya terdiri dari 2 menu: **Docs** (selalu aktif dengan `is-active`, mengarah ke `index.html`) dan **Example** (hanya teks tanpa link aktif: `href="#" onclick="return false;"`). Jangan mencantumkan *Components* atau *Tokens* di navbar atas.

---

## 8. Aturan Git & Workflow
1. **Jangan melakukan `git push`** kecuali secara eksplisit diperintahkan oleh pengguna.

