// File: components/UserGuide.tsx
import React from 'react';

export default function UserGuide({ dict }: { dict: any }) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
        <h2 className="text-3xl font-extrabold text-red-900 mb-6 border-b border-gray-100 pb-4">Panduan Penggunaan CDSS</h2>
        <div className="space-y-8 text-gray-700 leading-relaxed">
          
          <div className="flex gap-4 items-start">
            <div className="bg-red-100 text-red-800 font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0">1</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pilih Modul Evaluasi</h3>
              <p>Pada halaman utama (Kalkulator Klinis), pilih salah satu dari tiga tab yang tersedia sesuai kebutuhan klinis pasien: <b>AI Prediksi Mortalitas</b>, <b>AI Prediksi Lama Rawat</b>, atau <b>Rekomendasi Dosis Klinis</b>.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="bg-red-100 text-red-800 font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0">2</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Input Parameter Klinis</h3>
              <p>Masukkan data klinis pasien yang didapat dari rekam medis atau pemeriksaan laboratorium terbaru. Anda dapat menggunakan fitur <b>Hitung Otomatis</b> untuk kalkulasi skor CTP dan GFR (CKD-EPI 2021) jika parameter penyusunnya tersedia, atau memasukkannya secara manual.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="bg-red-100 text-red-800 font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0">3</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pilih Obat (Khusus Modul Dosis)</h3>
              <p>Jika menggunakan modul Rekomendasi Dosis, centang obat-obatan yang direncanakan untuk dievaluasi, lalu tandai jika terdapat komplikasi akut penyerta (seperti AKI, Sepsis, atau Hepatorenal Syndrome).</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="bg-red-100 text-red-800 font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0">4</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analisis & Verifikasi Profesional</h3>
              <p>Klik tombol proses untuk mengirim data ke server kecerdasan buatan. <b>Penting:</b> Hasil yang ditampilkan oleh sistem (probabilitas maupun rentang dosis) bersifat panduan pendukung keputusan. Lakukan verifikasi akhir berdasarkan penilaian medis profesional Anda.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}