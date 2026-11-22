# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users:
- **Apoteker Klinis (Hospital Clinical Pharmacists)**: Melakukan telaah obat (*medication review*), penyesuaian dosis berbasis klirens ginjal dan fungsi hepatik, pencegahan interaksi obat-penyakit, serta proteksi terhadap risiko toksisitas obat di bangsal rawat inap.
- **Dokter Spesialis Penyakit Dalam / Subspesialis Gastroenterohepatologi (Attending Physicians / Hepatologists - DPJP)**: Mengevaluasi stratifikasi prognosis pasien sirosis hati akut terdekompensasi, merumuskan rencana terapi terpadu, dan mengambil keputusan medis selama ronde bangsal.

Secondary users:
- **Peneliti Kedokteran & Farmasi Klinis**: Menganalisis pola kesesuaian dosis, memvalidasi kinerja model prognostik kecerdasan buatan, dan mengeksplorasi data luaran klinis sirosis berbasis bukti.

## Product Purpose

CirrhoSmart AI adalah sistem pendukung keputusan klinis (*Clinical Decision Support System* / CDSS) berbasis kecerdasan buatan hibrida (*Hybrid AI*) yang dikembangkan untuk membantu tenaga kesehatan dalam penatalaksanaan komprehensif pasien sirosis hati rawat inap. Sistem ini memadukan:
1. Model prediktif kuantitatif *Machine Learning* untuk estimasi probabilitas mortalitas dan lama rawat inap (*Length of Stay* > 7 hari) yang dilengkapi dengan transparansi faktor risiko melalui *Explainable AI* (SHAP).
2. *Decision Engine* deterministik berbasis aturan klinis internasional (AASLD, EASL, KDIGO, FDA) untuk rekomendasi penyesuaian dosis obat personal pada 8 kelompok farmakoterapi sirosis.

Tujuan utama produk adalah menurunkan risiko morbiditas, komplikasi iatrogenik, dan mortalitas akibat toksisitas obat pada pasien sirosis dengan disfungsi multiorgan (hati dan ginjal).

## Positioning

Berbeda dari sistem pendukung keputusan konvensional yang berbasis kalkulator terisolasi (misal hanya kalkulator CTP atau MELD) ataupun model AI generatif yang rentan terhadap halusinasi dosis obat hepatotoksik:
- CirrhoSmart AI mengadopsi pendekatan **Hybrid AI**: memisahkan estimasi risiko probabilistik (didukung machine learning yang divalidasi pada kohort nyata 583 pasien rawat inap) dari rekomendasi dosis obat yang dieksekusi oleh mesin aturan deterministik (*zero-hallucination guarantee*).
- Menyediakan transparansi klinis penuh melalui dekomposisi kontribusi lokal SHAP (*TreeExplainer*), sehingga klinisi dapat melihat secara presisi faktor klinis mana yang menaikkan atau menurunkan risiko pasien dari nilai dasar (*base value*).

## Operating Context

- **Lingkungan Penggunaan**: Bangsal rawat inap rumah sakit rujukan tipe A/B, ruang perawatan intensif hepatologi, atau ruang diskusi ronde klinis interdisipliner farmasis-dokter.
- **Alur Kerja Pengguna**:
  1. Klinisi membuka aplikasi web melalui browser desktop atau tablet di ruang rawat.
  2. Memasukkan data klinis dan laboratorium saat admisi/pemeriksaan terkini (didukung kalkulator otomatis CTP dan eGFR CKD-EPI 2021).
  3. Memilih modul yang diperlukan: Prediksi Mortalitas (+ analisis SHAP), Prediksi Lama Rawat, atau Rekomendasi Dosis Klinis.
  4. Meninjau rekomendasi dosis individual beserta peringatan *Red Flag* (kondisi kritis: AKI/CKD, Sepsis, Asites Refrakter, HRS, kenaikan transaminase).
  5. Melakukan adjudikasi klinis profesional sebelum meresepkan atau menyetujui dispensing farmasi.
- **Kondisi Perangkat**: Web responsif (desktop, laptop bangsal, tablet), mendukung operasi dwi-bahasa (Bahasa Indonesia & English).

## Capabilities and Constraints

Confirmed Capabilities:
- **AI Prediksi Mortalitas**: Model Random Forest ($n=395$, AUROC 0.8391) memproyeksikan probabilitas kematian rawat inap dengan dekomposisi 5 kontributor SHAP terbesar.
- **AI Prediksi Lama Rawat**: Model Random Forest ($n=583$, AUROC 0.5664) memproyeksikan risiko rawat inap memanjang (>7 hari) dengan kalkulasi skor MELD dinamis (UNOS).
- **Rekomendasi Dosis Klinis**: Aturan deterministik 8 obat/regimen (Spironolakton, Furosemid, Kombinasi Spironolakton+Furosemid, Propranolol, Carvedilol, Ampisilin-Sulbaktam, Levofloxacin, Azitromisin) berdasarkan CTP (A/B/C), eGFR, MAP, dan *safety overrides*.
- **Kalkulator Terintegrasi**: Perhitungan otomatis skor CTP (5 parameter), laju filtrasi glomerulus eGFR CKD-EPI 2021 (*race-free*), MAP (dari SBP & DBP), dan INR (dari PT pasien, kontrol, dan ISI).
- **Penyimpanan Data Aman**: Integrasi database relasional Supabase PostgreSQL via Prisma v7.8 dengan otorisasi berbasis token rahasia (`SAVE_TOKEN`) untuk mencegah *dataset poisoning*.

Constraints:
- Rekomendasi sistem bersifat pendukung keputusan (*decision support*) dan bukan pengganti penilaian medis dokter penanggung jawab (DPJP) atau apoteker klinis.
- Validasi model saat ini merupakan validasi internal (*Repeated Stratified 5-Fold Cross-Validation*); validasi eksternal prospektif multisenter direkomendasikan sebelum implementasi skala nasional.

## Brand Commitments

- **Nama Produk**: CirrhoSmart AI (*CirrhoSmart_AI*)
- **Identitas Visual**: Skema warna merah marun / burgundi medis (`red-900`, `rose-900`, `emerald`, `amber`, `gray-50`) yang mencerminkan nuansa hepatologi klinis serius, tepercaya, dan profesional.
- **Tone of Voice**: Ilmiah, objektif, berbasis bukti (*evidence-based*), presisi, dan suportif terhadap keputusan klinis.
- **Afiliasi Akademis**: Kolaborasi riset Doktoral Farmasi Universitas Andalas (apt. Serdiani, S.Si, M.Farm) dan Teknik Informatika Institut Teknologi Bandung (Yavie Azka Putra Araly).

## Evidence on Hand

- **Naskah Publikasi Ilmiah**: `journal/CirrhoSmart_AI_manuscript.docx` (dan `journal/manuscript_text.txt`) berjudul *"Development and Internal Validation of an Explainable Artificial Intelligence Model for Personalized Drug Dose Recommendations in Hospitalized Patients with Liver Cirrhosis"*.
- **Kohort Pasien Nyata**: $n = 583$ pasien sirosis hati rawat inap di RSUP Dr. M. Djamil Padang (Januari 2024 – Juni 2025).
- **Persetujuan Etik**: Komisi Etik Penelitian Kesehatan RSUP Dr. M. Djamil Padang No. `DP.04.03/D.XVI.2.3/1027/2025` (22 Juli 2025).
- **Model Terlatih**: File model Joblib terverifikasi pada folder `deployment/` (`model_rf_mortalitas_final.joblib`, `model_rf_los_final.joblib`, `daftar_fitur_m1.joblib`, `daftar_fitur_m2_los.joblib`).
- **Validasi Konkordansi**: Uji kesesuaian dosis pada 5 kasus representatif bertingkat dengan tingkat konkordansi 84.2% (16/19 evaluasi sesuai label pakar).

## Product Principles

1. **Safety & Primum Non Nocere First**: Dalam penatalaksanaan sirosis dengan disfungsi organ ganda, pencegahan toksisitas obat dan perburukan gagal ginjal akut (AKI/HRS) lebih diutamakan daripada eskalasi dosis agresif. Protokol *Safety Overrides* selalu menimpa kalkulasi standar.
2. **Zero-Hallucination Dosing**: Rekomendasi dosis obat wajib mengacu pada pohon keputusan deterministik dan pedoman literatur resmi (AASLD, EASL, KDIGO, FDA). AI generatif tidak boleh digunakan untuk menciptakan rekomendasi dosis.
3. **Transparent & Explainable AI**: Seluruh prediksi machine learning wajib dapat dipertanggungjawabkan melalui pembongkaran variabel kontributor risiko lokal (SHAP), bukan sekadar angka probabilitas tanpa dasar.
4. **Frictionless Clinical Workflow**: Meminimalkan beban kognitif klinisi dengan kalkulasi otomatis parameter penyusun (CTP, GFR, MAP, INR) dan antarmuka responsif dwi-bahasa yang cepat.

## Accessibility & Inclusion

- Antarmuka web responsif untuk penggunaan di monitor komputer bangsal maupun tablet portabel saat ronde klinis.
- Dwi-bahasa penuh (Bahasa Indonesia dan Bahasa Inggris) untuk mengakomodasi penggunaan lokal rumah sakit di Indonesia serta diseminasi internasional.
- Kontras teks tinggi (skema teks abu-abu gelap hingga hitam di atas latar belakang putih/abu-abu netral) dengan label semantik yang jelas untuk memastikan keterbacaan parameter lab yang kritis.
