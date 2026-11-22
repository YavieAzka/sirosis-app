# CirrhoSmart AI — Mobile Implementation Roadmap (Android / Expo)

> **Target Reader:** AI Coding Agent & Mobile Engineers  
> **Target Platform:** Android (`platforms: ["android"]`, `com.cirrhosmart.ai`)  
> **Stack:** Expo SDK 58 · Expo Router · React Native 0.88 · TypeScript (Strict)  
> **Design Authority:** Skill `impeccable` (konvensi dari `web/.impeccable`, panduan platform `android.md`, mode `operate.md`, `adapt.native.md`, `audit.native.md`) + `web/PRODUCT.md`

---

## Aturan & Prinsip Wajib bagi Agent (Non-Negotiable Constraints)

1. **Zero-Hallucination Clinical Safety (`web/PRODUCT.md`):**
   - Model ML (Random Forest + SHAP) dan Rule Engine dosis (8 obat) **tetap dieksekusi di server backend** (`web/api/*.py`). Jangan pernah memindahkan logika atau mencoba mereplikasi/menggenerasi rekomendasi dosis dengan AI generatif di aplikasi mobile.
   - Selalu tampilkan *Medical Disclaimer* dan peringatan review klinis (`DPJP` & `Apoteker Klinis`) pada hasil prediksi maupun rekomendasi dosis.
2. **Keamanan Kredensial & Database:**
   - Aplikasi mobile **tidak boleh** terhubung langsung ke PostgreSQL/Prisma atau menyertakan `DATABASE_URL`, `DIRECT_URL`, maupun `SAVE_TOKEN` di dalam `.env` / bundle client.
   - Endpoint penyimpanan (`POST /api/database/save`) wajib memicu input manual `SAVE_TOKEN` oleh pengguna di UI modal/dialog otorisasi.
3. **Android-First Native Conformance (Anti-Web-Port):**
   - Dilarang keras menyalin pola web (`<select>`, hover states, tombol bergaya HTML, `window.alert`) atau pola iOS (bottom-only navigation tanpa Material 3, back gesture iOS, kontrol Cupertino).
   - Semua komponen, navigasi, tipografi (`sp`), target sentuh (`>= 48×48 dp`), elevasi tonal, edge-to-edge `WindowInsets`, *Predictive Back*, dan *Bottom Sheet / Dialog / Snackbar* wajib mengikuti **Material Design 3**.
4. **Impeccable Skill Gates:**
   - Sebelum menulis kode UI apa pun, agent wajib menjalankan alur `impeccable` untuk konteks `mobile/` (lihat **Phase 1** di bawah), serta membaca `reference/craft-floor.md` sebelum melakukan edit UI pertama.

---

## Peta Referensi Kode Sumber (Existing Repo Context)

| Artefak | Lokasi | Peran untuk Implementasi Mobile |
| :--- | :--- | :--- |
| Product Truth | `web/PRODUCT.md` | Sumber utama audiens, tujuan produk, prinsip keselamatan, warna brand, dan batasan klinis |
| Kalkulator Klinis | `web/utils/clinical.ts` | Rumus `hitungSkorCtp` dan `hitungGfrCkdEpi` (CKD-EPI 2021) yang dapat di-port langsung |
| Komponen Web (Referensi Fitur) | `web/app/[lang]/components/*.tsx` | Referensi seluruh *field*, alur sinkronisasi state, dan tampilan hasil |
| Data Metodologi & Referensi | `web/app/[lang]/components/methodologyData.ts` | Dataset statis kohort (`n=583`), metrik tabel 3, konkordansi tabel 4, dan 44 referensi DOI |
| Kamus Bahasa | `web/dictionaries/id.json`, `web/dictionaries/en.json` | Basis terjemahan ID & EN |
| API Mortalitas | `web/api/predict.py` | Kontrak `POST /api/predict` (8 fitur + SHAP top-5) |
| API Lama Rawat (LoS) | `web/api/predict_los.py` | Kontrak `POST /api/predict_los` (8 input + UNOS MELD dinamis) |
| API Rekomendasi Dosis | `web/api/dosis.py` | Kontrak `POST /api/dosis` (8 regimen obat + safety overrides) |
| API Simpan Database | `web/app/api/database/save/route.ts` | Kontrak `POST /api/database/save` (validasi `SAVE_TOKEN` + Prisma PostgreSQL) |
| Setup Awal Mobile | `mobile/app.json`, `mobile/package.json`, `mobile/.env.example` | Konfigurasi Expo SDK 58 Android & `EXPO_PUBLIC_API_URL` |

---

## Phase 1 — Fondasi Desain Impeccable & Kontrak Produk Mobile

> **Gate:** Jangan mulai membuat layar fitur sebelum `mobile/PRODUCT.md` dan kontrak desain terselesaikan.

### 1.1 Inisialisasi Artefak Impeccable di `mobile/`
1. Jalankan context loader Impeccable dari folder `mobile/` (atau target `mobile/src/app/index.tsx`):
   - Buat `mobile/.impeccable/config.json` (set `buildPath` sesuai preferensi user: `"code"` atau `"comp"`).
   - Jalankan `/impeccable init` untuk menghasilkan `mobile/PRODUCT.md` (`<!-- impeccable:product-schema 1 -->`) dengan `Platform: android`, mengadopsi kebenaran produk dari `web/PRODUCT.md` sekaligus menetapkan batasan khusus perangkat genggam/tablet bangsal Android.
   - Tanyakan atau konfirmasi keputusan yang masih terbuka sebelum coding:
     - Dukungan **Dark Mode** pada rilis Android v1 (saat ini `mobile/app.json` diset `"userInterfaceStyle": "light"`; `android.md` merekomendasikan Dark Theme sebagai *first-class scheme* jika diaktifkan).
     - Pilihan library komponen Material 3 (mis. `react-native-paper` v5 MD3 + custom clinical tokens, atau primitif RN + token Material 3).
     - Target dukungan **Tablet Bangsal** (`>= 600 dp` Navigation Rail + Split-Pane) pada v1 atau Phone-first dengan layout adaptif sejak awal.
2. Jalankan `/impeccable shape` / `new-work` untuk menetapkan *Surface Briefs* dan *Direction Contract*:
   - **Mode `Operate`** untuk seluruh layar kerja klinis (Prediksi Mortalitas, Prediksi Lama Rawat, Rekomendasi Dosis, Modal/Sheet Simpan Data, Kalkulator Otomatis). Prioritas: *scanability*, kecepatan input saat ronde bangsal, kejelasan state (`default`, `focus`, `disabled`, `loading`, `error`, `validation`), nol animasi dekoratif yang memperlambat tugas.
   - **Mode `Read`** untuk layar informasi & literatur (Tentang CirrhoSmart & Tim, Panduan Penggunaan, Metodologi & 44 Referensi). Prioritas: keterbacaan teks panjang, hierarki tipografi jelas, pencarian & filter kategori yang responsif.

### 1.2 Sistem Token & Pedoman Desain Android (Material Design 3)
1. **Palet Warna & Peran Material 3 (`src/theme/colors.ts`):**
   - Terjemahkan identitas merah marun hepatologi dari `web/PRODUCT.md` ke *Material 3 Color Roles* (bukan *hard-coded hex* tersebar di komponen):
     - `primary`: Medical Maroon (`#7F1D1D`), `onPrimary`: `#FFFFFF`, `primaryContainer`: `#FEE2E2` / `#FECACA`, `onPrimaryContainer`: `#450A0A`.
     - `surface`, `surfaceContainerLow`, `surfaceContainer`, `surfaceContainerHigh`, `onSurface`, `onSurfaceVariant`, `outline`, `outlineVariant` (menggunakan lapisan netral tinggi kontras untuk keterbacaan parameter lab).
     - **Clinical Semantic Roles (Light & Dark variants):**
       - *Safe / Survive / Use*: Emerald (`#059669` / surface `#ECFDF5` / border `#A7F3D0`).
       - *Warning / Monitor / Reduce / LoS >= 50%*: Amber (`#B45309` / surface `#FFFBEB` / border `#FDE68A`).
       - *High Risk / Avoid / Critical Override*: Clinical Red (`#B91C1C` / surface `#FEF2F2` / border `#FECACA`).
       - *Info / LoS < 50%*: Clinical Blue (`#2563EB` / surface `#EFF6FF` / border `#BFDBFE`).
   - Sediakan pasangan token lengkap untuk **Dark Theme** bila `userInterfaceStyle` diaktifkan ke `"automatic"`.
2. **Tipografi & Skala `sp` (`src/theme/typography.ts`):**
   - Gunakan *Material Type Scale* (`display`, `headline`, `title`, `body`, `label` — `large/medium/small`).
   - Gunakan sistem font Android (**Roboto**) untuk teks UI & label agar konsisten secara native, dan font monospace (`Source Code Pro` atau monospace sistem) dengan `fontVariant: ['tabular-nums']` untuk seluruh angka probabilitas, skor CTP, eGFR, MELD, MAP, INR, kontribusi SHAP, dan rentang dosis.
   - Jangan pernah memblokir *font scaling* OS (`allowFontScaling` tetap `true`); layout harus lolos pengujian `font_scale = 1.3`.
3. **Spasial, Target Sentuh & Elevasi (`src/theme/tokens.ts`):**
   - **Minimum Touch Target:** Semua kontrol interaktif (tombol, checkbox obat, radio toggle, chip filter, tab bar, ikon mata token) minimal **`48×48 dp`** dengan jarak antar target minimal **`8 dp`**.
   - **Elevasi Tonal:** Gunakan perbedaan warna `surfaceContainer*` + border tipis (`outlineVariant`) sebagai pemisah kartu utama; hindari bayangan web berlebihan.
4. **Topologi Navigasi Adaptif (`src/app/` + `adapt.native.md`):**
   - **Compact (`width < 600 dp`, HP Android):** Material 3 **Bottom Navigation Bar** dengan **4 destinasi utama**:
     1. `Mortalitas` (AI Mortality Predictor)
     2. `Lama Rawat` (AI LoS Predictor)
     3. `Dosis` (Clinical Dose Engine)
     4. `Info & Riset` (About, User Guide, Methodology & References)
   - **Medium / Expanded (`width >= 600 dp`, Tablet Bangsal / Landscape):** Otomatis beralih via *Window Size Classes* ke **Navigation Rail** di sisi kiri + tata letak **Two-Pane** (Panel kiri: formulir parameter klinis; Panel kanan: hasil prediksi/SHAP/rekomendasi dosis atau detail metodologi) — tidak pernah meregangkan tata letak HP ke layar tablet.
   - **Top App Bar:** Menampilkan judul modul aktif, badge bahasa (`ID` / `EN`) yang mudah dijangkau, serta tombol cepat bantuan/disclaimer medis.
   - **System Back & Gesture:** Pastikan tombol/gestur Back Android menutup Bottom Sheet/Dialog secara natural dan tidak pernah menjebak pengguna; evaluasi `predictiveBackGestureEnabled` di `mobile/app.json` saat *native build* diuji.

---

## Phase 2 — Infrastruktur Inti, Kontrak API, Logika Klinis & i18n

### 2.1 Dependensi yang Perlu Dipasang (`npx expo install`)
Pasang hanya paket yang kompatibel dengan Expo SDK 58:
- **UI & Ikon:** `lucide-react-native`, `react-native-svg` (dan `react-native-paper` jika diputuskan memakai MD3 kit pada Phase 1).
- **Bottom Sheet & Overlay:** `@gorhom/bottom-sheet` (sudah kompatibel dengan `react-native-gesture-handler` & `react-native-reanimated` yang terpasang) atau modal sheet native untuk pemilih dropdown parameter klinis & tampilan hasil.
- **Lokalisasi:** `expo-localization`, `i18next`, `react-i18next`.
- **Utilitas:** `@react-native-async-storage/async-storage` (untuk menyimpan preferensi bahasa `id`/`en` & status konfirmasi disclaimer awal; **bukan** untuk menyimpan `SAVE_TOKEN` permanen tanpa persetujuan keamanan), `@react-native-community/netinfo` (deteksi offline sebelum inferensi API), `expo-haptics` (feedback taktil halus pada aksi krusial seperti submit/override peringatan).
- **Dev/Testing:** `jest`, `jest-expo`, `@testing-library/react-native` untuk pengujian unit rumus klinis, pemetaan payload, dan state komponen.

### 2.2 Arsitektur Direktori Target di `mobile/src/`
```text
mobile/src/
├── app/                        # Expo Router file-based routes & layouts
│   ├── _layout.tsx             # Root providers (SafeArea, Theme, i18n, Snackbar/Portal)
│   ├── (tabs)/                 # Compact Navigation Bar / Expanded Navigation Rail shell
│   │   ├── _layout.tsx
│   │   ├── index.tsx           # Tab 1: AI Prediksi Mortalitas
│   │   ├── los.tsx             # Tab 2: AI Prediksi Lama Rawat
│   │   ├── dose.tsx            # Tab 3: Rekomendasi Dosis Klinis
│   │   └── info.tsx            # Tab 4: Hub Informasi (About, Guide, Methodology)
│   └── info/                   # Stack routes dari Hub Informasi (jika dipisah per layar)
│       ├── about.tsx
│       ├── guide.tsx
│       └── methodology.tsx
├── components/
│   ├── ui/                     # Primitif Material 3 (Button, Card, NumberField, SelectSheet, SegmentedToggle, Chip, Snackbar, Dialog)
│   └── clinical/               # Komponen domain reusable: CtpCalculator, GfrCalculator, InrInput, MapInput, SaveDatabaseDialog, DisclaimerBanner
├── features/                   # View-model / hooks & sub-komponen spesifik tiap modul
│   ├── mortality/
│   ├── los/
│   ├── dose/
│   └── methodology/            # Tabel 1-4, SHAP summary, daftar & filter 44 referensi
├── services/
│   └── api/                    # HTTP client (fetch + AbortController timeout) & typed endpoints
│       ├── client.ts
│       ├── predict.ts
│       ├── predictLos.ts
│       ├── dose.ts
│       └── databaseSave.ts
├── utils/
│   ├── clinical.ts             # CTP, CKD-EPI 2021 GFR, INR, MAP, UNOS MELD
│   └── validation.ts           # Validasi rentang fisiologis & sanitasi angka desimal (koma -> titik)
├── locales/                    # Kamus i18n lengkap id.json & en.json (tanpa teks hardcoded)
├── constants/
│   └── methodologyData.ts      # Diadaptasi dari web/app/[lang]/components/methodologyData.ts
├── theme/                      # Material 3 Light/Dark tokens, typography, spacing
└── types/                      # Kontrak TypeScript request/response API & domain models
```

### 2.3 Kontrak API & Penanganan Error (`src/services/api/` & `src/types/`)
Semua request memakai `EXPO_PUBLIC_API_URL` dengan `Content-Type: application/json`, timeout (mis. 15–20 detik untuk *cold start* Vercel Python), dan parsing error terstruktur:

1. **`POST ${API_URL}/api/predict`**
   - **Payload:** `{ komor_sepsis: 0|1, urea_baseline: number, natrium_baseline: number, komp_eh: 0|1, inr_baseline: number, sgot_baseline: number, gfr: number, ctp_encoded: 1|2|3 }`
   - **Respons 200:** `{ probability: number, predicted_class: 0|1, base_value: number, shap_contributions: Array<{ feature: string, contribution: number, value_input: number }> }`
   - **Respons 500:** `{ error: string }`
2. **`POST ${API_URL}/api/predict_los`**
   - **Payload:** `{ komor_sepsis: 0|1, komp_eh: 0|1, ctp_encoded: 1|2|3, bilirubin_baseline: number, kreatinin_baseline: number, inr_baseline: number, sgot_baseline: number, usia: number, gfr: number }` *(Catatan: `jk` hanya dipakai klien untuk CKD-EPI; `meld_score` dihitung oleh backend dari `bilirubin_baseline`, `inr_baseline`, `kreatinin_baseline`)*.
   - **Respons 200:** `{ probability_los: number }`
3. **`POST ${API_URL}/api/dosis`**
   - **Payload:** `{ gfr: number, ctp: "A"|"B"|"C", map_value: number|null, ascites_refrakter: 0|1, hrs: 0|1, gagal_ginjal_akut: 0|1, sepsis_pneumonia: 0|1, ast_alt_tinggi: 0|1, obat_pilihan: DrugId[] }`
   - *Rule UI → Payload:* `gagal_ginjal_akut = (isCKD || isAKI) ? 1 : 0`.
   - **Respons 200:** `{ info?: DoseItem }` (jika `obat_pilihan` kosong) atau `Record<DrugId, { obat: string, status: string, rentang_dosis: string, alasan: string, peringatan: string[] }>`.
4. **`POST ${API_URL}/api/database/save`**
   - **Payload (Mortality):** `{ ...mortalityInputs, probability, predicted_class, base_value, shap_contributions, token, nama_pasien?, rekam_medis? }` — pastikan `shap_contributions` selalu array valid (bukan `null`/`undefined`) karena skema Prisma `MortalityPrediction.shapContributions` bertipe `Json` non-nullable.
   - **Payload (LoS):** `{ ...losInputs, jk, probability_los, meldScore, token, nama_pasien?, rekam_medis? }`.
   - **Respons 401:** Token salah/kosong (`{ error }`) → tampilkan pesan error inline di dialog tanpa menutup dialog atau menghapus input klinis.

### 2.4 Utilitas Klinis & Perbaikan Paritas (`src/utils/clinical.ts`)
1. **`hitungSkorCtp(params)`:** Sama persis dengan `web/utils/clinical.ts` (`5–6 → A`, `7–9 → B`, `10–15 → C`).
2. **`hitungGfrCkdEpi(scr, age, gender)`:** Formula CKD-EPI 2021 *race-free*.
3. **`hitungInr(ptPatient, ptNormal, isi)`:** `(ptPatient / ptNormal) ** isi` dengan guard `ptNormal > 0 && ptPatient > 0 && isi > 0`.
4. **`hitungMap(sbp, dbp)`:** `(sbp + 2 * dbp) / 3` dengan guard `sbp > 0 && dbp > 0`.
5. **`hitungMeldUnos(bil, inr, cr)` (Perbaikan Paritas dari Web):**
   - Di `web/app/[lang]/components/LosPredictor.tsx`, `calculateMeld` belum menerapkan *floor* `1.0` dan *cap* kreatinin `4.0`, sedangkan backend `web/api/predict_los.py` menerapkannya.
   - Di mobile, implementasikan standar UNOS persis seperti `predict_los.py`:
     - `b = Math.max(bil, 1.0)`, `i = Math.max(inr, 1.0)`, `c = Math.min(Math.max(cr, 1.0), 4.0)`
     - `Math.round((3.78 * Math.log(b) + 11.2 * Math.log(i) + 9.57 * Math.log(c) + 6.43) * 10) / 10`
6. **Normalisasi Input Desimal Lokal Indonesia:** Banyak keyboard Android di Indonesia memakai koma (`,`) untuk pemisah desimal; buat helper sanitasi `parseLocaleNumber` yang mengubah `,` menjadi `.` sebelum validasi numerik.

### 2.5 Lokalisasi Penuh (`src/locales/id.json` & `en.json`)
- Migrasikan seluruh key dari `web/dictionaries/id.json` dan `en.json`.
- **Perbaiki kesenjangan i18n dari `web/`:** Seluruh label pada modul **LoS**, label lab (`Urea Baseline`, `Natrium Baseline`, `SGOT Baseline`), **About**, **Methodology**, pesan error jaringan, dan teks *validation* wajib 100% berada di kamus `id.json` & `en.json` (tidak ada string bahasa Indonesia yang di-*hardcode* di komponen TSX).
- *Catatan:* Untuk respons `dosis.py` (status/alasan/peringatan) yang saat ini dikirim backend dalam bahasa Indonesia, tampilkan apa adanya dengan label/header UI sesuai bahasa aktif.

---

## Phase 3 — Komponen Form & Kalkulator Klinis Native (`src/components/`)

1. **`ClinicalNumberInput`:**
   - Menggunakan `keyboardType="decimal-pad"` (`inputMode="decimal"`), label jelas di atas field, unit pengukuran (`mg/dL`, `mEq/L`, `U/L`, `mL/min`, `mmHg`, `detik`, `Tahun`) sebagai suffix, state *read-only* visual jelas saat mode auto-calculate aktif, serta pesan error inline di bawah field.
2. **`MaterialSelectSheet` (Pengganti `<select>` HTML):**
   - Tombol field `>= 48 dp` menampilkan pilihan saat ini + ikon chevron, membuka **Material Bottom Sheet** dengan daftar radio/item `>= 48 dp` agar nyaman dipilih dengan satu ibu jari di bangsal.
3. **`CtpCalculator`:**
   - Toggle Switch Material untuk `Hitung Otomatis dari Parameter Klinis`.
   - 5 pemilih parameter (`bilirubin`, `albumin`, `inr`, `ascites`, `encephalopathy`) dalam Bottom Sheet.
   - Menampilkan chip ringkasan `Total Skor` & `Kelas CTP (A/B/C)` secara *real-time*.
   - Mendukung sinkronisasi otomatis ke `komp_eh` (`encephalopathy >= 2 ? 1 : 0`) pada modul Mortalitas & LoS, dan pemilih manual CTP (disabled saat auto aktif).
4. **`GfrCalculatorCard`:**
   - Switch `Hitung Otomatis (CKD-EPI 2021)`.
   - Pada modul Mortalitas & Dosis: input internal `Serum Kreatinin`, `Usia`, dan *Segmented Control* `Jenis Kelamin (L/P)`.
   - Pada modul LoS: menarik `kreatinin_baseline` dan `usia` langsung dari form utama, hanya menampilkan pemilih `Jenis Kelamin (L/P)` dengan keterangan sumber otomatis.
5. **`InrInputCard`:**
   - *Material Segmented Buttons*: `Input Langsung` vs `Hitung dari PT` (`PT Pasien`, `PT Normal/Kontrol`, `Nilai ISI` default `1.0`), menampilkan kartu hasil kalkulasi INR secara langsung.
6. **`MapInputCard`:**
   - Switch `Hitung Otomatis dari Tekanan Darah` (`SBP` & `DBP` mmHg → `MAP`), tetap opsional pada modul Dosis.

---

## Phase 4 — Tiga Modul Klinis Utama (`Operate Mode`)

### 4.1 Tab 1: AI Prediksi Mortalitas (`MortalityPredictor`)
- **Form Input:** `Status Sepsis (0/1)`, `Ensefalopati Hepatikum (0/1)`, `CtpCalculator`, `InrInputCard`, `Urea Baseline`, `Natrium Baseline`, `SGOT Baseline`, `GfrCalculatorCard`.
- **Ergonomi Mobile:** `KeyboardAware` scroll dengan tombol aksi utama sticky/mudah dijangkau (`Analisis Probabilitas Mortalitas`), validasi sebelum submit (menyorot field kosong/tidak valid tanpa pop-up `alert()`).
- **Tampilan Hasil (Bottom Sheet / Modal Screen):**
  - Kartu probabilitas utama dengan `tabular-nums`: merah (`>= 0.4`) atau emerald (`< 0.4`), plus badge `AI Label` (`High Risk / Mortalitas` vs `Survive`).
  - Bagian **Transparansi SHAP (`SHAP.TreeExplainer`)**: daftar terurut 5 kontributor terbesar dengan label klinis ramah pengguna (`FEATURE_LABELS`), nilai input pasien, bar visual arah dampak (`+` menaikkan risiko / `-` menurunkan risiko), serta persentase kontribusi.
  - Blok **Otorisasi Simpan ke Database:** input opsional `Nama Pasien` & `No. Rekam Medis` (atau fallback Anonim), input `Token Rahasia` dengan ikon *toggle visibility*, tombol `Simpan` dengan loading state dan Snackbar sukses / error inline 401.

### 4.2 Tab 2: AI Prediksi Lama Rawat (`LosPredictor`)
- **Form Input:** `Status Sepsis (0/1)`, `Ensefalopati Hepatikum (0/1)`, `CtpCalculator`, `Usia`, `Kreatinin Baseline`, `Bilirubin Baseline`, `INR Baseline`, `SGOT Baseline`, `GfrCalculatorCard` (menggunakan `jk`).
- **Kartu Skor UNOS MELD Live:** Ringkasan menonjol di atas tombol submit yang menampilkan skor MELD terhitung otomatis (atau status menunggu input lengkap).
- **Tampilan Hasil:**
  - Persentase risiko rawat inap `> 7 hari` (`>= 0.5` amber peringatan vs `< 0.5` biru informasi).
  - Blok **Otorisasi Simpan ke Database** mengirimkan `probability_los` dan `meldScore`.

### 4.3 Tab 3: Evaluasi & Rekomendasi Dosis Klinis (`DoseRecommender`)
- **Pemilih Obat (3 Grup Warna Terkendali):**
  - *Diuretik:* `Kombinasi (Spiro+Furo)` **mutually exclusive** terhadap `Spironolakton Tunggal` dan `Furosemid Tunggal` (nonaktifkan opsi berlawanan secara visual dengan teks bantuan jelas + tombol `Pilih Semua` yang memilih kombinasi + beta-bloker + antibiotik, persis seperti logika `handleToggleAllObat` di `web/`).
  - *Beta-Bloker:* `Propranolol`, `Carvedilol`.
  - *Antibiotik:* `Ampisilin-Sulbaktam`, `Levofloxacin`, `Azitromisin`.
- **Parameter Pasien & Red Flags:** `GfrCalculatorCard`, `MapInputCard`, `CtpCalculator`, dan 6 *checkbox* komplikasi akut (`Ascites Refrakter`, `HRS`, `Sepsis/Pneumonia`, `AST/ALT > 2x Normal`, `CKD`, `AKI`).
- **Tampilan Hasil:**
  - Di **Tablet (`>= 600 dp`)**: tampil *side-by-side* di panel kanan secara langsung.
  - Di **HP (`< 600 dp`)**: buka halaman hasil terdedikasi atau *full-height expandable sheet* dengan tombol Back native agar klinisi dapat meninjau daftar obat tanpa *scroll* berulang ke atas.
  - Banner wajib `PERINGATAN - Wajib Review Klinis`, lalu kartu per obat dengan:
    - Chip status berpola warna semantik (`Avoid/Hindari` merah, `Reduce/Monitor` amber, `Use` emerald, `N/A` netral)
    - Rentang dosis dalam tipografi tebal & `tabular-nums`
    - Alasan klinis (`Alasan:`)
    - Kotak sorotan `Perhatian Khusus` berisi daftar *monitoring* & *stop criteria*.

---

## Phase 5 — Hub Informasi, Panduan & Metodologi (`Read Mode`)

### 5.1 Tab 4: Info & Riset (`InfoHub`)
Menyediakan menu navigasi native menuju 3 layar pembacaan + pengaturan cepat:
1. **Pengaturan Bahasa & Disclaimer Medis:** Switch `Indonesia (ID)` / `English (EN)` + ringkasan *Medical Disclaimer* dan tautan ke versi web/repository bila relevan.
2. **Tentang CirrhoSmart & Tim Peneliti (`about.tsx`):**
   - Hero ringkas & 4 kartu metrik kunci (`583 Pasien`, `0.8391 AUROC`, `84.2% Konkordansi`, `KEPK No. 1027`).
   - Penjelasan 3 masalah klinis & 3 modul inti + alur 4 langkah bangsal.
   - Profil 6 anggota tim peneliti & dewan promotor (salin aset foto dari `web/public/images/` ke `mobile/assets/images/team/` agar tetap tampil offline, dengan avatar inisial sebagai fallback) + aksi tombol email via `Linking.openURL('mailto:...')`.
3. **Panduan Penggunaan (`guide.tsx`):**
   - 4 langkah terstruktur cara penggunaan modul CDSS (memilih modul, input parameter/auto-kalkulator, memilih obat & komplikasi, verifikasi profesional).
4. **Metodologi & Referensi Ilmiah (`methodology.tsx`):**
   - Navigasi sub-bagian horizontal (*Material Scrollable Tabs / Filter Chips*) untuk 7 topik:
     1. Ringkasan & Alur Riset
     2. Karakteristik Kohort (Tabel 1 — daftar kartu responsif, hindari tabel lebar terpotong di layar HP)
     3. Arsitektur Hybrid AI & Preprocessing (MICE, UNOS MELD, StandardScaler/OHE)
     4. Komparasi Kinerja Model (Tabel 3 — kartu perbandingan per metrik agar mudah dibaca di portrait maupun tabel penuh di tablet/landscape)
     5. Transparansi AI (SHAP ranking Mortalitas vs LoS + Studi Kasus Pasien 64 thn)
     6. Evaluasi Dosis & Konkordansi (Tabel 2 distribusi & Tabel 4 validasi 5 pasien bertingkat)
     7. Pedoman & 44 Referensi Ilmiah (Input pencarian `SearchBar` + chip filter kategori `All`, `Guidelines`, `Dosing & PK`, `AI/ML`, `Prognosis`, membuka tautan DOI via `expo-web-browser`).

---

## Phase 6 — Hardening, Pengujian, Audit Impeccable & Build Android

### 6.1 Pengujian Otomatis
1. **Unit Tests (Jest):**
   - Uji `hitungSkorCtp`, `hitungGfrCkdEpi`, `hitungInr`, `hitungMap`, `hitungMeldUnos` (termasuk *edge case*: `0`, angka negatif, desimal koma, Cr `> 4.0`, Bil `< 1.0`).
   - Uji mapper payload ke `/api/predict`, `/api/predict_los`, `/api/dosis`, dan `/api/database/save` (memastikan `isCKD || isAKI` → `gagal_ginjal_akut`, serta `shap_contributions` tidak pernah `null` saat menyimpan Mortalitas).
   - Uji state handling error `401`, `500`, timeout, dan kondisi offline.
2. **Static Checks:**
   - `npm run typecheck` (`tsc --noEmit`) — wajib 0 error.
   - `npm run lint` (`expo lint`) — wajib 0 error/warning.
   - `npx expo-doctor` — wajib 20/20 lulus.

### 6.2 Verifikasi Perangkat & Emulator Android (`android.md` & `audit.native.md`)
Lakukan pengujian pada minimal **1 Phone Emulator/Device** dan **1 Tablet Emulator** (portrait & landscape) dengan bukti `adb exec-out screencap -p`:
1. **Edge-to-Edge & Keyboard/IME:** Pastikan input lab terbawah pada setiap form tidak tertutup *soft keyboard* atau *system navigation bar*.
2. **System Back & Predictive Back:** Pastikan gestur Back menutup sheet/dialog secara bertahap dan menavigasi stack dengan benar.
3. **Font Scaling Accessibility (`sp`):** Uji dengan `adb shell settings put system font_scale 1.3` (lalu kembalikan `1.0`) — pastikan tidak ada label, nilai `tabular-nums`, atau tombol yang terpotong (*clipped*).
4. **Dark Theme Pass (jika diaktifkan):** Uji dengan `adb shell cmd uimode night yes` — pastikan kontras teks dan warna semantik klinis tetap terbaca jelas.
5. **TalkBack & Touch Targets:** Audit seluruh elemen interaktif memiliki `accessibilityLabel` / `accessibilityRole` jelas dan ukuran sentuh minimal `48×48 dp`.

### 6.3 Penutupan Siklus Impeccable & Rilis Build
1. Jalankan **`/impeccable audit`** (target skor kesehatan native **>= 18/20** pada 5 dimensi: Accessibility, Performance, Appearance & Theming, Platform Conformance, Adaptivity).
2. Perbaiki temuan P0/P1 dalam satu batch, lalu jalankan **`/impeccable polish`**.
3. Jalankan **`/impeccable document`** di `mobile/` untuk menghasilkan `mobile/DESIGN.md` dari implementasi token & komponen aktual.
4. Siapkan **`mobile/eas.json`** untuk profil distribusi Android (`development`, `preview` APK internal untuk uji tim klinis di RSUP Dr. M. Djamil / Unand, dan `production` AAB).

---

## Daftar Keputusan Terbuka (Untuk Dikonfirmasi Sebelum Eksekusi UI)

Sebelum agent memulai **Phase 1**, konfirmasikan hal berikut dengan user:
1. **URL Backend Production:** Apakah `mobile` akan mengarah ke deployment Vercel yang sudah ada untuk `web/`, dan jika ya, apa domain URL-nya?
2. **Dark Mode & Dynamic Color:** Apakah versi awal Android mendukung **Light + Dark Theme** penuh sejak rilis pertama, atau **Light-only** terlebih dahulu seperti versi web?
3. **Target Perangkat Primer:** Apakah **Tablet Bangsal** (`>= 600 dp`) menjadi target wajib di rilis v1 (memerlukan *two-pane* & *Navigation Rail* sejak awal) atau prioritas HP Android dahulu?
4. **Library Komponen Material 3:** Apakah menggunakan `react-native-paper` (MD3) sebagai pondasi komponen, atau primitif React Native kustom dengan token Material 3?
