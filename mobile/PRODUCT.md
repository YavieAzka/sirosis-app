# Product

<!-- impeccable:product-schema 1 -->

## Platform

android

## Stack

Expo SDK 58, Expo Router, React Native 0.88, TypeScript (Strict), Custom React Native primitives with Material Design 3 token system (user choice).

## Users

Primary users:
- **Apoteker Klinis (Hospital Clinical Pharmacists)**: Melakukan telaah obat (*medication review*), penyesuaian dosis berbasis klirens ginjal dan fungsi hepatik, pencegahan interaksi obat-penyakit, serta proteksi terhadap risiko toksisitas obat di bangsal rawat inap melalui ponsel maupun tablet bangsal.
- **Dokter Spesialis Penyakit Dalam / Subspesialis Gastroenterohepatologi (Attending Physicians / Hepatologists - DPJP)**: Mengevaluasi stratifikasi prognosis pasien sirosis hati akut terdekompensasi, merumuskan rencana terapi terpadu, dan mengambil keputusan medis selama ronde bangsal (*bedside rounds*).

Secondary users:
- **Peneliti Kedokteran & Farmasi Klinis**: Menganalisis pola kesesuaian dosis, memvalidasi kinerja model prognostik kecerdasan buatan, dan meninjau metodologi serta referensi ilmiah berbasis bukti.

## Product Purpose

CirrhoSmart AI (Android) adalah aplikasi mobile *Clinical Decision Support System* (CDSS) berbasis kecerdasan buatan hibrida (*Hybrid AI*) yang dirancang untuk penggunaan langsung di bangsal rawat inap (*point-of-care*). Aplikasi ini memadukan:
1. Model prediktif kuantitatif *Machine Learning* (dieksekusi di server backend `web/api/*`) untuk estimasi probabilitas mortalitas dan lama rawat inap (*Length of Stay* > 7 hari) dengan transparansi kontribusi faktor risiko melalui *Explainable AI* (SHAP).
2. *Decision Engine* deterministik berbasis aturan klinis internasional (AASLD, EASL, KDIGO, FDA) untuk rekomendasi penyesuaian dosis obat personal pada 8 obat/regimen sirosis.

Tujuan utama produk adalah menurunkan risiko morbiditas, komplikasi iatrogenik, dan mortalitas akibat toksisitas obat pada pasien sirosis dengan disfungsi multiorgan (hati dan ginjal) secara cepat di ujung jari klinisi saat visite bangsal.

## Positioning

Berbeda dari kalkulator klinis terisolasi (yang hanya menghitung CTP atau MELD) maupun model AI generatif yang rentan terhadap halusinasi dosis obat hepatotoksik:
- CirrhoSmart AI memisahkan estimasi risiko probabilistik (Machine Learning tervalidasi pada kohort nyata 583 pasien rawat inap) dari rekomendasi dosis obat yang dijalankan oleh *rule engine* deterministik di server (*zero-hallucination guarantee*).
- Menyajikan transparansi lokal SHAP (`TreeExplainer`) agar klinisi dapat mengaudit parameter klinis pendorong risiko dari nilai dasar kohort.

## Operating Context

- **Lingkungan Penggunaan**: Bangsal rawat inap rumah sakit rujukan tipe A/B, ruang perawatan intensif hepatologi, dan ronde klinis interdisipliner farmasis–dokter (dalam pencahayaan terang bangsal maupun jaga malam/ruang gelap).
- **Perangkat Target**: Ponsel Android (*compact*, operasi satu tangan saat bergerak di bangsal) dan Tablet Android bangsal (`>= 600 dp`, tampilan berdampingan *two-pane* untuk input dan hasil evaluasi secara bersamaan).
- **Alur Kerja Pengguna**:
  1. Klinisi membuka aplikasi Android saat visite bangsal atau telaah resep.
  2. Memasukkan parameter klinis/laboratorium (atau mengaktifkan kalkulator otomatis lokal CTP, eGFR CKD-EPI 2021, INR dari PT, MAP dari TD, serta skor UNOS MELD).
  3. Mengirim evaluasi ke server API CirrhoSmart AI untuk Prediksi Mortalitas (+ SHAP), Prediksi Lama Rawat, atau Rekomendasi Dosis 8 obat.
  4. Meninjau hasil risiko, peringatan *Red Flag* (AKI/CKD, Sepsis, Asites Refrakter, HRS, AST/ALT > 2x normal), dan *stop criteria*.
  5. Melakukan adjudikasi klinis profesional serta (bila diperlukan) menyimpan kasus ke database terotorisasi menggunakan `SAVE_TOKEN` yang dimasukkan manual oleh pengguna.

## Capabilities and Constraints

Confirmed Capabilities:
- **AI Prediksi Mortalitas**: Terhubung ke `POST /api/predict` (Random Forest, $n=395$, AUROC 0.8391) dengan 8 fitur input dan dekomposisi 5 kontributor SHAP terbesar.
- **AI Prediksi Lama Rawat**: Terhubung ke `POST /api/predict_los` (Random Forest, $n=583$, AUROC 0.5664) dengan kalkulasi skor UNOS MELD dinamis (`floor 1.0`, `Cr cap 4.0`).
- **Rekomendasi Dosis Klinis**: Terhubung ke `POST /api/dosis` untuk 8 obat/regimen (`Spironolakton+Furosemid`, `Spironolakton`, `Furosemid`, `Propranolol`, `Carvedilol`, `Ampisilin-Sulbaktam`, `Azitromisin`, `Levofloxacin`) berbasis CTP, eGFR, MAP, dan *safety overrides*.
- **Kalkulator Klinis Lokal (Offline-capable Math)**: Skor CTP (5 parameter), eGFR CKD-EPI 2021 (*race-free*), MAP (SBP/DBP), INR (PT pasien, kontrol, ISI), dan skor UNOS MELD.
- **Penyimpanan Data Aman**: Terhubung ke `POST /api/database/save` (Supabase PostgreSQL via Prisma) dengan otorisasi manual `SAVE_TOKEN` per penyimpanan; tanpa menyimpan kredensial database atau token permanen di perangkat.
- **Referensi & Metodologi Terintegrasi**: Karakteristik kohort (`n=583`), komparasi model, analisis SHAP, konkordansi dosis (`84.2%`), panduan pengguna, serta 44 referensi DOI yang dapat dicari dan difilter.

Constraints:
- Rekomendasi sistem bersifat pendukung keputusan (*clinical decision support*), bukan pengganti keputusan DPJP atau Apoteker Klinis.
- Seluruh inferensi ML & rule engine dosis membutuhkan konektivitas ke API backend CirrhoSmart AI; perangkat harus menangani kondisi offline/timeout secara informatif.
- Validasi model saat ini merupakan validasi internal (*Repeated Stratified 5-Fold Cross-Validation*).

## Brand Commitments

- **Nama Produk**: CirrhoSmart AI
- **Package Android**: `com.cirrhosmart.ai`
- **Afiliasi Akademis**: Kolaborasi riset Doktoral Farmasi Universitas Andalas (apt. Serdiani, S.Si, M.Farm bersama Dewan Promotor) dan Teknik Informatika Institut Teknologi Bandung (Yavie Azka Putra Araly).
- **Tone of Voice**: Ilmiah, objektif, berbasis bukti (*evidence-based*), presisi, dan suportif terhadap keselamatan pasien.
- **Identitas**: Mewarisi karakter medis marun/burgundi profesional dari `web/PRODUCT.md` dan diadaptasi ke bahasa desain native Android (Material Design 3).

## Evidence on Hand

- **Naskah Publikasi Ilmiah**: `research/manuscript/CirrhoSmart_AI_manuscript.docx` berjudul *"Development and Internal Validation of an Explainable Artificial Intelligence Model for Personalized Drug Dose Recommendations in Hospitalized Patients with Liver Cirrhosis"*.
- **Kohort Pasien Nyata**: $n = 583$ pasien sirosis hati rawat inap di RSUP Dr. M. Djamil Padang.
- **Persetujuan Etik**: Komisi Etik Penelitian Kesehatan RSUP Dr. M. Djamil Padang No. `DP.04.03/D.XVI.2.3/1027/2025` (22 Juli 2025).
- **Validasi Konkordansi**: 84.2% (16/19 evaluasi kasus klinis sesuai label pakar).
- **Aset Foto Tim Peneliti**: Tersedia di `web/public/images/` (`serdiani.jpeg`, `promotor-1.jpeg`..`promotor-4.jpeg`, `yavie.jpg`).

## Product Principles

1. **Safety & Primum Non Nocere First**: Pencegahan toksisitas obat dan perburukan gagal ginjal akut (AKI/HRS) selalu lebih diutamakan; *Safety Overrides* dan *stop criteria* tidak boleh tersembunyi.
2. **Zero-Hallucination Dosing**: Rekomendasi dosis selalu berasal dari mesin aturan deterministik di server (`dosis.py`), tidak pernah disintesis di klien atau oleh AI generatif.
3. **Transparent & Explainable AI**: Prediksi risiko mortalitas wajib disertai kontribusi SHAP lokal agar klinisi memahami faktor pendorongnya.
4. **Native Point-of-Care Speed**: Antarmuka harus mematuhi ergonomi Android (kontrol native, input desimal cepat, *Predictive Back*, bebas elemen web/desktop yang menghambat).

## Accessibility & Inclusion

- Mendukung **Light Theme** dan **Dark Theme** penuh untuk keterbacaan di bangsal terang maupun kondisi cahaya redup/jaga malam.
- Mendukung penuh **HP Android** dan **Tablet Bangsal** (`>= 600 dp`) secara adaptif tanpa meregangkan tata letak.
- Mendukung **Dwi-Bahasa penuh** (Bahasa Indonesia & English) di seluruh modul tanpa teks *hardcoded*.
- Mematuhi aksesibilitas Android: skala huruf OS (`sp` tanpa memblokir *font scaling*, diuji pada `1.3x`), target sentuh minimal `48×48 dp` dengan jarak `>= 8 dp`, pelabelan *TalkBack*, kontras teks >= 4.5:1, angka laboratorium/probabilitas `tabular-nums`, dan menghormati pengaturan *Reduce Motion* OS.
