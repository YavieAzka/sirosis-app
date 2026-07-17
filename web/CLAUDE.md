# Konteks Proyek: Clinical Decision Support System (CDSS) Sirosis Hati

## 1. Deskripsi Proyek (Project Overview)
Proyek ini adalah pengembangan prototipe aplikasi web *Clinical Decision Support System* (CDSS) tingkat lanjut yang dikhususkan untuk penatalaksanaan komprehensif pasien sirosis hati. Sistem ini merupakan project disertasi milik rekan S3 sebagai domain expert, dan saya sebagai AI Engineernya. 

Karena kompleksitas penyakit sirosis hati—di mana penurunan fungsi hepatik (liver) sering kali merambat pada disfungsi renal (ginjal) dan hemodinamik—sistem ini mengadopsi arsitektur **Hybrid Artificial Intelligence**:

1.  **Data-Driven AI (Machine Learning):** Menggunakan algoritma *Random Forest* (yang telah dilatih dengan *dataset* klinis spesifik) untuk memprediksi *clinical outcomes* secara kuantitatif. Model ini berfokus pada dua prediksi utama: Probabilitas Mortalitas (Risiko Kematian) dan *Length of Stay* (Lama Rawat Inap).
2.  **Logic-Driven AI (Rule-Based Expert System):** Sebuah *Decision Engine* deterministik yang menerjemahkan matriks panduan klinis (literatur medis dan validasi pakar) menjadi sistem rekomendasi otomatis. Sistem ini menghitung batasan dosis, interval, dan kontraindikasi farmakoterapi secara presisi berdasarkan parameter vital pasien (Skor CTP, GFR, MAP, dan komorbiditas akut).

Seluruh sistem dibalut dengan antarmuka pengguna (UI) modern yang mengutamakan kecepatan interaksi (kalkulasi otomatis di sisi klien) dan keamanan integritas data untuk keperluan riset *evidence-based medicine*.

---

## 2. Tech Stack & Infrastruktur
* **Frontend:** Next.js (App Router, React, TypeScript), Tailwind CSS, Lucide Icons. Menggunakan arsitektur modular (*Clean Architecture*) yang memisahkan *layouting* utama dengan komponen logika klinis (`components/MainApp.tsx` & `utils/clinical.ts`).
* **Backend:** Vercel Serverless Functions. Menggunakan Node.js (`route.ts`) untuk interaksi *database* dan Python (`BaseHTTPRequestHandler`) untuk mengeksekusi model Machine Learning (Joblib).
* **Database:** Supabase (PostgreSQL).
* **ORM:** Prisma Client (v7.8.0) dengan arsitektur **Driver Adapter** (`@prisma/adapter-pg` dan `pg` Node.js murni). Konfigurasi ini secara spesifik dirancang untuk mengatasi masalah *Cold Start* pada Vercel Serverless dan memisahkan koneksi *pooling* aplikasi dengan koneksi langsung (CLI) untuk migrasi skema.

---

## 3. Progress Fitur Utama Saat Ini (Selesai & Tervalidasi)

### A. Tab 1: AI Prediksi Mortalitas (Prognosis Klinis)
Modul ini bertugas mengevaluasi risiko kematian pasien berdasarkan parameter laboratorium dan klinis *baseline*.
* **Kalkulator Otomatis Terintegrasi:** * **Skor CTP (Child-Turcotte-Pugh):** Menghitung otomatis total skor dan kelas (A/B/C) secara *real-time* dari input derajat Bilirubin, Albumin, INR, Ascites, dan Ensefalopati Hepatikum (EH). Fitur ini memiliki sinkronisasi cerdas (misal: input CTP EH otomatis memperbarui status komplikasi EH di form utama).
    * **GFR (Glomerular Filtration Rate):** Menggunakan formula **CKD-EPI 2021 (Race-free)**. Menghitung otomatis nilai laju filtrasi glomerulus berdasarkan Serum Kreatinin, Usia, dan Jenis Kelamin.
* **Explainable AI (SHAP):** Tidak seperti AI konvensional yang bersifat *black-box*, modul ini mengimplementasikan `SHAP.TreeExplainer`. Setelah prediksi keluar, sistem merender panel analisis klinis yang membedah kontribusi persentase tiap parameter (seperti Sepsis, Urea, Natrium, INR, SGOT) terhadap keputusan akhir AI. Dokter dapat melihat faktor dominan apa yang menarik probabilitas mortalitas pasien menyimpang (naik/turun) dari nilai risiko dasar (*base value*).

### B. Tab 2: AI Prediksi Lama Rawat (Length of Stay / LoS)
Modul ini membantu manajemen bangsal rumah sakit dengan memproyeksikan apakah pasien memiliki risiko rawat inap memanjang (lebih dari 7 hari).
* **Pengumpulan Parameter Spesifik:** Memanfaatkan subset fitur prediktor yang disesuaikan, termasuk Sepsis, EH, Kreatinin Baseline, Bilirubin Baseline, INR, SGOT, Usia, GFR, dan Kelas CTP.
* **Efisiensi Antarmuka:** Mewarisi komponen kalkulator otomatis (CTP & GFR) dari Tab Mortalitas agar UI tetap konsisten. Model ML mengeluarkan klasifikasi persentase risiko LoS panjang (Indikator warna: Biru untuk < 50%, Kuning/Amber untuk ≥ 50%).

### C. Tab 3: Evaluasi & Rekomendasi Dosis Klinis (Expert System)
Modul paling kompleks yang bertindak sebagai "Apoteker Digital" untuk mencegah toksisitas obat pada fungsi hati/ginjal yang menurun.
* **Cakupan Farmakoterapi:**
    * *Diuretik:* Spironolactone, Furosemide, atau kombinasinya.
    * *Beta-bloker:* Propranolol dan Carvedilol.
    * *Antibiotik:* Ampisilin-Sulbaktam, Levofloxacin, Azitromisin.
    * *Analgetik:* Parasetamol (opsional).
* **Sistem Triase Logika (Decision Engine):** Rekomendasi dihasilkan berdasarkan pemrosesan simultan dari: Kelas CTP (A/B/C), GFR/CrCl (rentang normal hingga gagal ginjal), MAP (Mean Arterial Pressure), dan Berat Badan.
* **Safety Overrides (Protokol Kondisi Kritis):** Memiliki algoritma deteksi *Red Flag*. Jika dokter mencentang kondisi akut seperti **Gagal Ginjal Akut (AKI/CKD)**, **Sepsis/Pneumonia**, **Ascites Refrakter**, atau **AST/ALT > 2x Normal**, sistem akan melakukan *override* (menimpa) dosis standar dan memunculkan peringatan **Avoid** (Hindari Mutlak) atau **Reduce** (Kurangi Dosis/Hentikan Sementara), lengkap dengan penjelasan parameter *stop criteria* (misal: "Hentikan bila Na+ < 125").

### D. Sistem Keamanan & Integritas Data (Sanitasi Backend)
Mengingat purwarupa ini di-deploy secara *live* dan terbuka di Vercel, sistem dilengkapi dengan proteksi *database* tingkat tinggi untuk mencegah masuknya data sampel palsu (*dataset poisoning*).
* **Otorisasi Berbasis Token:** Penyimpanan data ke Supabase dikunci oleh UI *Modal Pop-up* yang meminta `SAVE_TOKEN` rahasia. Permintaan dengan token yang salah akan langsung ditolak oleh backend (Error 401) tanpa menyentuh *database*.
* **Data Destructuring & Auto-Fill:** Backend API (`route.ts`) diprogram untuk menyeleksi data (*stripping*) secara dinamis. Variabel pembantu dari UI (seperti `token`, `ctp_bilirubin`, status *auto-calculate*) otomatis dibuang agar tidak menyebabkan Prisma ORM *crash*. Backend juga otomatis melakukan *generate* `patient_id` (format: `PAT-Timestamp-Random`) dan mengisi nilai *default* (`lama_rawat: 0` jika kosong) untuk mematuhi ketatnya skema PostgreSQL.

---

## 4. Konfigurasi Arsitektur Database (CRITICAL CONTEXT)
Proyek ini berjalan di atas ekosistem **Prisma v7.8.0** yang menggunakan *Breaking Changes* arsitektur. Jika ingin menambahkan fitur backend, wajib mematuhi aturan ini:
1.  **`schema.prisma`:** Blok `datasource` TIDAK BOLEH diisi dengan properti `url` atau `directUrl`.
2.  **`prisma.config.ts`:** File ini HANYA dipakai oleh Prisma CLI (saat eksekusi `npx prisma generate` atau migrasi). Memuat `url: process.env.DIRECT_URL` di dalam blok `datasource`.
3.  **`app/database/save/route.ts`:** Inisialisasi koneksi **WAJIB** menggunakan `Pool` murni dari package `pg` (mengambil `DATABASE_URL`), lalu dibungkus oleh `PrismaPg`, dan dieksekusi via `new PrismaClient({ adapter })`.

## 5. Agenda Diskusi Sesi Ini
Terdapat bug dalam logika rule engine untuk rekomendasi dosis, misalnya untuk propanorol: Jika pengguna memasukkan kondisi pasien memiliki derajat CTP B, namun skor MAP-nya dibawah 65mmHg, alasan penggunaan propanorol akan menyebutkan CTP score C, begitu pula dengan carvedilol, dimana itu tidak sesuai dengan file rujukan milik rekan domain expert.