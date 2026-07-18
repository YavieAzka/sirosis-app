// File: components/Methodology.tsx
import React from 'react';

export default function Methodology({ dict }: { dict: any }) {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
        <h2 className="text-3xl font-extrabold text-red-900 mb-6 border-b border-gray-100 pb-4">Metodologi Riset & AI</h2>
        
        <div className="space-y-10 text-gray-700">
          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Arsitektur Hybrid AI</h3>
            <p className="leading-relaxed mb-4">Sistem ini memadukan dua pendekatan utama dalam informatika medis untuk memberikan dukungan keputusan yang holistik dan dapat dipertanggungjawabkan:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><b>Data-Driven Machine Learning:</b> Digunakan untuk memprediksi probabilitas Mortalitas dan Length of Stay (LoS). Model dilatih menggunakan algoritma <i>Random Forest</i> dan <i>XGBoost</i> yang terbukti handal dalam menangani data tabular klinis.</li>
              <li><b>Logic-Driven Expert System:</b> Digunakan untuk modul Rekomendasi Dosis Obat. Menggunakan pohon keputusan (Decision Tree) deterministik yang ketat berdasarkan panduan klinis global, guna meminimalisir risiko <i>hallucination</i> dari AI pada penentuan dosis hepatotoksik.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Pemrosesan Data Klinis (ML Engineering)</h3>
            <p className="leading-relaxed mb-4">Data rekam medis dunia nyata seringkali memiliki banyak kecacatan. Sistem ini dikembangkan dengan teknik *preprocessing* tingkat lanjut:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><b>MICE Imputation:</b> Penanganan <i>missing values</i> (data kosong) tidak menggunakan rata-rata sederhana, melainkan teknik <i>Multiple Imputation by Chained Equations</i> melalui algoritma Random Forest untuk menjaga struktur non-linear dari kondisi biologis pasien.</li>
              <li><b>Class Imbalance Mitigation:</b> Mengatasi ketidakseimbangan kelas pasien (misalnya antara pasien yang hidup dan meninggal) menggunakan teknik bobot algoritmik (<i>scale_pos_weight</i> dan <i>class_weight='balanced'</i>) dikombinasikan dengan Stratified 5-Fold Cross-Validation untuk mencegah <i>overfitting</i>.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Referensi Klinis Utama</h3>
            <p className="leading-relaxed mb-4">Logika penyesuaian dosis obat didasarkan pada studi literatur sistematis dan matriks komplikasi dari penelitian doktoral, mengacu pada pedoman:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>[placeholder]</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}