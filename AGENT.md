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
5. **Zero Inline `<style>` di HTML (Pemisahan Total Styling ke SCSS)**:
   - **Dilarang keras menyertakan tag `<style>`** di dalam file HTML mana pun (`index.html`, `introduction.html`, `alert.html`, dsb).
   - Seluruh kebutuhan styling preview, layout dokumentasi, tabel token, card panduan, breadcrumb, step list, badge status, toast notification, maupun utilitas visual lainnya **wajib ditulis dan disatukan di dalam `src/scss/layout/_docs.scss`** (atau komponen SCSS terkait di `src/scss/components/`) dengan memanfaatkan token desain di `_variables.scss`.
   - File HTML hanya boleh me-link file output CSS utama: `<link rel="stylesheet" href="./dist/uikit.css">`.
   - Menjaga seluruh markup HTML tetap bersih, semantik, mudah dibaca, dan modular.
   - Aturan ini berlaku mutlak untuk setiap pembuatan halaman HTML baru maupun saat refaktor/pembaruan halaman yang sudah ada seterusnya.

---

## 8. Aturan Git & Workflow
1. **Jangan melakukan `git push`** kecuali secara eksplisit diperintahkan oleh pengguna.


---

## 9. Acuan Desain HTML Dokumentasi Komponen (Standard Component Blueprint)
1. **Acuan Standar (Standard Reference)**:
   - Setiap pembuatan atau penambahan halaman dokumentasi komponen baru wajib mengacu langsung pada struktur standar yang telah diterapkan secara seragam pada `button.html`, `badge.html`, dan `alert.html`.
   - Tidak memerlukan file template terpisah (`component-template.html`). Cukup ikuti blueprint anatomi di bawah ini.

2. **Anatomi & Struktur Wajib Setiap Halaman Komponen**:
   - **Head & Styles**:
     - Memuat CSS terkompilasi: `<link rel="stylesheet" href="./dist/uikit.css">`.
     - **Dilarang keras menyertakan tag `<style>`** (Wajib mematuhi Aturan 7.5: Zero Inline Style).
   - **Top Navbar (`.doc-navbar`)**:
     - Brand logo/badge OWW UIKit.
     - Navigasi 2 item: **Docs** (selalu aktif dengan class `.is-active`, mengarah ke `index.html`) dan **Example** (nonaktif: `href="#" onclick="return false;"`).
     - Search bar dengan shortcut visual `⌘K`.
     - Tombol toggle tema Sun/Moon (`#themeToggleBtn`).
     - External link ke GitHub repository.
   - **Shell Pembungkus Layout**:
     - Menggunakan standar: `<section class="section"><div class="container doc-layout">`.
   - **Left Sidebar (`.doc-sidebar`)**:
     - **Getting Started**: Introduction (`introduction.html`), Quick Start (`index.html`).
     - **Design Tokens**: Typography, Colors, Spacing, Shadows, Border Radius.
     - **Components (Wajib Urut Abjad A-Z)**:
       - Alert (`alert.html`)
       - Avatar (`avatar.html`)
       - Badge (`badge.html`)
       - Button (`button.html`)
       - Card
       - Icons & Flags (`icons.html`)
       - Input & Forms
       - Modal
       - *(Komponen baru wajib disisipkan sesuai posisi alfabetisnya di semua file HTML dokumentasi)*.
       - Tautan komponen yang sedang dibuka wajib diberi class `.is-active`.
   - **Center Main Content (`main.doc-content`)**:
     - Breadcrumb semantik: `<nav class="breadcrumb">...</nav>` (`Docs` > `Components` > `[Nama Komponen]`).
     - Header komponen: `<h1 class="text-5xl-bold doc-content__title">[Nama Komponen]</h1>` dan deskripsi ringkas `<p class="doc-content__lead">...</p>`.
     - **Section Overview (`#overview`)**:
       - Card demo: `<div class="doc-example">`.
       - Preview area: `<div class="doc-example__preview">`.
       - Code snippet area: `<div class="doc-example__code">`.
       - **Tombol Copy Code**: Wajib berbentuk **icon-only tanpa teks** (`.doc-example__copy-btn` dengan icon SVG, `onclick="copyCode(this)"`, `aria-label="Copy code"`, `title="Copy code"`).
     - **Section Varian & State**:
       - Core Variants (`#variants`)
       - Sizes Scale (`#sizes`)
       - Interactive States / Modifiers (`#states`)
     - **Section Design Tokens (`#design-tokens`)**:
       - Tabel referensi token menggunakan `<table class="doc-table">` yang merinci Token Name, SCSS Variable, Value, dan Description.
     - **Section Architecture / Rules (`#architecture` atau `#installation`)**:
       - Panduan penggunaan semantik, best practices, dan import SCSS komponen.
   - **Right Sidebar (On this page / TOC) (`aside.doc-toc`)**:
     - Daftar tautan anchor TOC (`.doc-toc__list`) yang sinkron persis dengan ID setiap heading section di main content.
   - **Toast Notification & Global Script**:
     - Elemen toast: `<div id="copyToast" class="doc-toast">Copied to clipboard!</div>`.
     - Script: `<script src="./src/js/main.js"></script>` diletakkan tepat sebelum `</body>`.

3. **Bahasa & Kebersihan Konten**:
   - Seluruh judul, paragraf, deskripsi, komentar kode, dan tabel wajib menggunakan **Bahasa Inggris (English)**.
   - **Dilarang keras menyertakan Node ID / nomor komponen Figma** di teks halaman.