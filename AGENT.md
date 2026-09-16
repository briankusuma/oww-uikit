# Aturan Ketat Perilaku AI (Agent Instructions)

Dokumen ini mendefinisikan aturan yang wajib dipatuhi oleh seluruh AI agent / model saat membaca, memodifikasi, menggenerasi, atau memperluas kode pada **OWW UIKit Design System**.

---

## 1. Desain Token & Anti-Hardcode (Single Source of Truth)

1. **Dilarang melakukan hardcode** pada nilai design seperti warna (hex, rgb, hsl), spacing (padding/margin), ukuran font, border radius, atau box shadow langsung di level komponen.

2. Semua nilai design harus merujuk ke token yang didefinisikan di:

   * `src/scss/abstract/_variables.scss`
   * atau melalui fungsi konversi di `src/scss/abstract/_functions.scss` (contoh: `rem(14px)`).

3. Jika sebuah token desain baru ditemukan di Figma (misalnya warna varian baru atau radius khusus), **wajib** mendaftarkan token tersebut ke `_variables.scss` terlebih dahulu dengan flag `!default`.

4. Jangan membuat token baru jika token existing sudah memiliki makna dan nilai yang sesuai.

5. Nilai struktural CSS seperti `100%`, `auto`, `inherit`, `0`, `display`, `position`, `transform`, dan nilai teknis lainnya boleh menggunakan literal apabila memang bukan merupakan design token.

---

## 2. Arsitektur Sass & Pemisahan Tanggung Jawab

1. Ikuti arsitektur modular Sass:

   * `abstract/`: variables, functions, mixins, dan kode deklaratif yang tidak menghasilkan output CSS secara langsung.
   * `base/`: CSS reset, typography global, dan normalisasi dasar HTML.
   * `components/`: styling komponen yang terisolasi.
   * `layout/`: styling layout dan dokumentasi global.

2. Hindari dependensi sirkular antar file SCSS.

3. Selalu gunakan fitur modern Sass (`@use`, `@forward`) dan hindari `@import` yang sudah berstatus *deprecated*.

4. Setiap token di `_variables.scss` **wajib** menyertakan flag `!default` agar dapat di-override oleh consumer design system.

5. Reuse existing functions, mixins, variables, dan utilities sebelum membuat yang baru.

---

## 3. Kesesuaian Desain Figma (Figma High Fidelity)

1. Setiap komponen yang diimplementasikan dari Figma harus merefleksikan spesifikasi Figma secara akurat:

   * Layout / auto-layout (direction, alignment, gap, padding).
   * Tipografi (font-family, font-size, font-weight, line-height, letter-spacing).
   * Warna (fill, stroke, opacity).
   * Border radius.
   * Shadow / effects.
   * States dan variants.

2. Penamaan komponen dan varian harus selaras dengan penamaan di Figma apabila memungkinkan.

3. Nilai dari Figma harus dipetakan ke existing design token terlebih dahulu.

4. Jangan membuat duplicate token hanya karena nilai Figma memiliki nama yang berbeda.

5. Jika spesifikasi Figma tidak lengkap, jangan mengarang nilai design yang tidak tersedia. Gunakan existing project pattern jika dapat diterapkan; jika tidak, laporkan kebutuhan tersebut.

---

## 4. Standar Penamaan & Konvensi CSS

1. Gunakan metodologi penamaan yang konsisten dan terprediksi, misalnya BEM:

   * `.oww-alert`
   * `.oww-alert__icon`
   * `.oww-alert--success`

2. Jangan menggunakan selector universal (`*`) atau selector tag mentah di dalam styling komponen untuk menghindari kebocoran style (*style pollution*).

3. Batasi kedalaman nesting maksimal **3 tingkat**.

4. Jangan memperkenalkan naming convention baru jika convention existing masih dapat digunakan.

---

## 5. Aksesibilitas & Performa (a11y & Performance)

1. Setiap elemen interaktif wajib memiliki state `:focus-visible` yang jelas menggunakan mixin `@include focus-ring` apabila mixin tersebut tersedia.

2. Pastikan rasio kontras teks dan background memenuhi standar **WCAG AA** yang berlaku.

3. Hindari animasi yang memicu layout re-flow.

4. Untuk animasi visual, prioritaskan `transform` dan `opacity` dibanding `width`, `height`, `top`, atau `left`.

5. Jangan menghapus atau melemahkan accessibility behavior existing tanpa alasan yang jelas dan sesuai task.

---

## 6. Prosedur Verifikasi

1. Setiap kali melakukan perubahan atau penambahan SCSS:

   * Jalankan `npm run build:css`.
   * Pastikan tidak terdapat syntax error.
   * Pastikan output CSS di `dist/` ter-compile dengan benar.

2. Jika project memiliki lint, test, atau validation script yang relevan, jalankan sesuai kebutuhan.

3. Jangan menyatakan bahwa build, test, atau verification berhasil jika proses tersebut belum benar-benar dijalankan.

4. Setelah perubahan selesai, periksa bahwa tidak terdapat perubahan yang tidak berkaitan dengan task.

---

## 7. Bahasa Dokumentasi & Preview HTML (Documentation & Preview Rules)

1. Seluruh teks konten, deskripsi, heading, tabel, tooltip, placeholder, dan komentar kode di semua file HTML preview wajib menggunakan **Bahasa Inggris (English)**.

2. **Tanpa Nomor / Node ID Figma**:

   Dilarang menampilkan Figma Node ID atau nomor internal Figma di dalam teks preview HTML.

3. **Urutan Abjad Komponen Sidebar (A-Z)**:

   Daftar komponen pada sidebar kiri dokumentasi wajib selalu diurutkan sesuai abjad A-Z.

4. Setiap komponen baru harus disisipkan sesuai posisi alfabetisnya di semua halaman preview HTML.

5. Komponen yang sedang dibuka wajib memiliki class `.is-active`.

6. **Struktur Navigasi Atas**:

   `.doc-navbar__nav` hanya terdiri dari:

   * **Docs** — aktif dengan `is-active`, mengarah ke `index.html`.
   * **Example** — nonaktif: `href="#" onclick="return false;"`.

7. Jangan mencantumkan `Components` atau `Tokens` di navbar atas.

8. **Zero Inline `<style>`**:

   * Dilarang menggunakan `<style>` di file HTML.

   * Styling dokumentasi harus berada di `src/scss/layout/_docs.scss` atau SCSS komponen terkait.

   * HTML hanya me-link CSS utama:

     `<link rel="stylesheet" href="./dist/uikit.css">`

   * Markup HTML harus tetap bersih, semantik, dan modular.

---

## 8. Aturan Git & Workflow

1. **Jangan melakukan `git push`** kecuali secara eksplisit diperintahkan oleh pengguna.

2. Jangan melakukan refactor besar, rename, reorganisasi folder, atau perubahan arsitektur yang tidak diperlukan oleh task.

3. Jangan mengubah banyak komponen sekaligus apabila task hanya meminta perubahan pada satu komponen.

4. Prioritaskan perubahan kecil dan terisolasi.

---

## 9. Existing Implementation First & Continuity

OWW UIKit dikembangkan secara incremental.

**Existing approved implementation adalah bagian dari specification project.**

Sebelum membuat komponen, halaman HTML, atau pattern baru:

1. Cari implementasi existing yang paling relevan.

2. Baca HTML dan SCSS-nya sebelum membuat implementasi baru.

3. Identifikasi pattern yang sudah digunakan.

4. Reuse pattern existing sebelum membuat pattern baru.

5. Jangan membuat ulang struktur yang sebenarnya sudah tersedia.

### Continuity Rule

Jika `HTML A` telah disetujui dan kemudian dibuat `HTML B`:

`HTML B` harus mengikuti struktur dan pattern `HTML A`, kecuali terdapat alasan khusus yang berasal dari kebutuhan komponen atau spesifikasi Figma.

Pertahankan sebanyak mungkin:

* HTML hierarchy.
* Class naming.
* Navbar.
* Sidebar.
* Documentation shell.
* Breadcrumb.
* Demo card.
* Preview area.
* Code area.
* Copy button.
* Section structure.
* Token table.
* TOC.
* Toast.
* Script placement.
* Responsive behavior.

**Jangan menganggap setiap task sebagai kesempatan untuk mendesain ulang struktur yang sudah disetujui.**

### Adapt, Don't Reinvent

Gunakan prinsip:

`Existing Pattern → Adapt → Extend → Create New`

Jangan langsung membuat pattern baru jika existing pattern masih dapat digunakan.

---

## 10. Standard Component Documentation Blueprint

### 10.1 Standard Reference

Setiap halaman dokumentasi komponen baru wajib mengacu pada implementasi komponen yang sudah disetujui.

Reference saat ini:

* `button.html`
* `badge.html`
* `alert.html`

Tidak diperlukan file `component-template.html`.

Existing approved component menjadi **reference implementation**.

Jika terdapat beberapa reference yang berbeda, gunakan reference yang paling relevan dengan komponen yang sedang dibuat.

Jika terdapat konflik yang signifikan antar-reference, jangan menebak. Gunakan pattern yang paling relevan dan laporkan konflik tersebut.

---

### 10.2 Anatomi Wajib

#### Head & Styles

```html
<link rel="stylesheet" href="./dist/uikit.css">
```

Tidak boleh terdapat `<style>` inline.

#### Top Navbar

`.doc-navbar` harus memiliki:

* Brand OWW UIKit.
* Docs.
* Example.
* Search dengan shortcut `⌘K`.
* Theme toggle `#themeToggleBtn`.
* External GitHub link.

#### Shell

Gunakan:

```html
<section class="section">
  <div class="container doc-layout">
```

#### Left Sidebar

**Getting Started**

* Introduction (`introduction.html`)
* Quick Start (`index.html`)

**Design Tokens**

* Typography
* Colors
* Spacing
* Shadows
* Border Radius

**Components — A-Z**

* Alert (`alert.html`)
* Avatar (`avatar.html`)
* Badge (`badge.html`)
* Button (`button.html`)
* Card
* Icons & Flags (`icons.html`)
* Input & Forms
* Modal

Komponen baru wajib dimasukkan sesuai urutan alfabetis.

#### Center Content

Gunakan:

```html
<main class="doc-content">
```

Struktur umum:

1. Breadcrumb.
2. Component title.
3. Component description.
4. Overview.
5. Variants.
6. Sizes.
7. States.
8. Design Tokens.
9. Architecture / Installation.

Overview menggunakan:

```html
<div class="doc-example">
  <div class="doc-example__preview">
  <div class="doc-example__code">
```

Copy button:

```html
<button
  class="doc-example__copy-btn"
  onclick="copyCode(this)"
  aria-label="Copy code"
  title="Copy code">
```

Copy button harus icon-only tanpa teks.

#### Right TOC

Gunakan:

```html
<aside class="doc-toc">
```

dan:

```html
.doc-toc__list
```

TOC harus sinkron dengan ID section pada main content.

#### Toast

Gunakan:

```html
<div id="copyToast" class="doc-toast">
  Copied to clipboard!
</div>
```

#### Script

Gunakan:

```html
<script src="./src/js/main.js"></script>
```

Script harus diletakkan tepat sebelum `</body>`.

---

## 11. Task Scope & Minimal Change Principle

Setiap task harus memiliki scope yang kecil dan jelas.

### Aturan:

1. Kerjakan hanya perubahan yang diperlukan untuk task.

2. Jangan mengubah unrelated files.

3. Jangan melakukan refactor unrelated.

4. Jangan memperbaiki component lain hanya karena ditemukan sesuatu yang menurut AI dapat dibuat lebih baik.

5. Jangan mengubah global token apabila perubahan tersebut tidak diperlukan.

6. Jangan mengubah architecture tanpa instruksi eksplisit.

7. Jangan rewrite seluruh file apabila perubahan kecil sudah cukup.

8. Jika perubahan di luar scope benar-benar diperlukan, jelaskan alasannya sebelum memperluas scope.

### Prioritas perubahan:

```text
Reuse
↓
Modify
↓
Extend
↓
Create New
↓
Refactor
```

Refactor adalah pilihan terakhir.

---

## 12. Rule Management & Project Decisions

### AGENTS.md

`AGENTS.md` adalah **permanent project contract**.

Jangan mengubah `AGENTS.md` secara otomatis selama mengerjakan task.

### DECISIONS.md

Gunakan `DECISIONS.md` untuk mencatat keputusan atau aturan baru yang ditemukan selama development.

Contoh:

```md
## Component Icons

- All interactive icons use the existing icon system.
- Icon-only buttons require an accessible label.
```

Jika keputusan tersebut ternyata hanya berlaku untuk satu komponen, jangan menjadikannya global.

Jika keputusan tersebut terbukti berlaku secara umum dan permanen, keputusan tersebut dapat dipromosikan ke `AGENTS.md` oleh pengguna.

### Current Task

Instruksi spesifik dari task yang sedang dikerjakan hanya berlaku pada task tersebut kecuali secara eksplisit ditetapkan sebagai project-wide rule.

---

## 13. Change Safety

1. Selalu lakukan perubahan sekecil mungkin.

2. Jangan menghapus existing implementation kecuali memang diperlukan.

3. Jangan mengganti pattern existing hanya karena AI memiliki preferensi implementasi lain.

4. Jangan melakukan mass replacement tanpa memeriksa dampaknya.

5. Jangan mengubah file yang tidak diperlukan.

6. Sebelum perubahan besar, periksa terlebih dahulu implementasi existing yang akan terdampak.

7. Jika perubahan berpotensi memengaruhi banyak komponen, berhenti dan laporkan dampaknya sebelum melanjutkan.

8. Jika task dapat diselesaikan tanpa refactor, jangan melakukan refactor.

---

## 14. Responsive & Cross-Component Consistency

1. Ikuti responsive behavior dari Figma apabila tersedia.

2. Gunakan breakpoint existing sebelum membuat breakpoint baru.

3. Jangan membuat breakpoint arbitrer tanpa kebutuhan.

4. Jika beberapa komponen memiliki responsive behavior yang sama, gunakan pattern yang sama.

5. Jangan membuat solusi responsive khusus apabila existing solution masih dapat digunakan.

---

## 15. No Guessing

Jangan mengarang atau mengasumsikan tanpa dasar:

* Design token.
* Warna.
* Spacing.
* Typography.
* Variant.
* State.
* Figma Node ID.
* Asset.
* URL.
* Breakpoint.
* Component behavior.
* API.
* Accessibility requirement.

Prioritaskan informasi dari:

1. User instruction.
2. `AGENTS.md`.
3. Current task.
4. Approved Figma specification.
5. Existing approved implementation.
6. `DECISIONS.md`.
7. Project conventions.

Jika informasi penting tidak tersedia, jangan membuat asumsi diam-diam.

---

## 16. Final Verification Checklist

Sebelum menyelesaikan task, periksa:

### Existing Code

* [ ] Existing implementation telah diperiksa.
* [ ] Existing pattern telah digunakan.
* [ ] Tidak membuat pattern baru tanpa alasan.
* [ ] Tidak ada unnecessary refactor.

### Scope

* [ ] Hanya file yang diperlukan yang diubah.
* [ ] Tidak ada unrelated changes.
* [ ] Tidak ada perubahan global yang tidak diperlukan.

### HTML

* [ ] Struktur mengikuti approved reference.
* [ ] Navbar konsisten.
* [ ] Sidebar konsisten.
* [ ] Sidebar Components A-Z.
* [ ] Active component benar.
* [ ] TOC sinkron dengan section IDs.
* [ ] Tidak ada `<style>` inline.
* [ ] Semua konten menggunakan English.
* [ ] Tidak ada Figma Node ID.

### SCSS

* [ ] Design values menggunakan existing tokens.
* [ ] Tidak ada duplicate token.
* [ ] Menggunakan `@use` / `@forward`.
* [ ] Tidak menggunakan deprecated `@import`.
* [ ] Token menggunakan `!default`.
* [ ] Nesting maksimal 3 tingkat.
* [ ] Tidak menggunakan selector universal/tag mentah di component styling.

### Accessibility

* [ ] Interactive elements memiliki `:focus-visible`.
* [ ] `focus-ring` digunakan apabila tersedia.
* [ ] Contrast memenuhi WCAG AA yang berlaku.

### Verification

* [ ] `npm run build:css` berhasil.
* [ ] Output CSS valid.
* [ ] Tidak ada error/deprecation yang disebabkan perubahan.
* [ ] Tidak ada perubahan unrelated.
* [ ] Tidak ada claim verification yang belum benar-benar dilakukan.

---

## 17. Core Principle

OWW UIKit harus dikembangkan sebagai **satu sistem yang konsisten**, bukan sebagai kumpulan implementasi yang berdiri sendiri.

AI harus selalu berpikir:

```text
Understand existing system
        ↓
Find approved reference
        ↓
Follow existing pattern
        ↓
Make the smallest required change
        ↓
Verify
        ↓
Continue the system
```

**Do not reinvent what already exists.**

**Do not expand the scope without necessity.**

**Do not change approved patterns without a clear reason.**

**Consistency is a requirement, not a preference.**
