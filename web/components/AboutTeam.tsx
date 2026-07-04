// File: components/AboutTeam.tsx
import React from 'react';

export default function AboutTeam() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gray-50 border-b border-gray-200 p-8 text-center">
          <h2 className="text-3xl font-extrabold text-red-900 mb-2">Tim Peneliti & Pengembang</h2>
        </div>
        
        <div className="p-8 md:p-12 space-y-12">
          {/* Profil 1 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 rounded-full bg-red-100 text-red-800 flex items-center justify-center text-3xl font-black shrink-0">
              S
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Serdiani</h3>
              <p className="text-red-800 font-semibold mb-3">Principal Clinical Researcher</p>
              <p className="text-gray-700 leading-relaxed mb-3">
                Kandidat Doktor (S3) Program Studi Farmasi, <b>Universitas Andalas</b>. 
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Bertanggung jawab sebagai peneliti utama dalam desain studi klinis, pengumpulan data rekam medis pasien di RSUP Dr. M. Djamil Padang, serta penyusunan dan validasi matriks penyesuaian dosis obat hepatotoksik berdasarkan parameter farmakokinetik dan farmakodinamik.
              </p>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Profil 2 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-3xl font-black shrink-0">
              Y
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Yavie Azka Putra Araly</h3>
              <p className="text-blue-800 font-semibold mb-3">Lead ML & Full-Stack Engineer</p>
              <p className="text-gray-700 leading-relaxed mb-3">
                Mahasiswa Program Studi Teknik Informatika, <b>Institut Teknologi Bandung (ITB)</b>.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Bertanggung jawab merancang arsitektur perangkat lunak CDSS dan mengeksekusi siklus hidup Machine Learning secara end-to-end. Mulai dari data cleaning, analisis eksploratori (EDA), feature engineering, melatih algoritma prediktif (Random Forest & XGBoost), hingga melakukan integrasi sistem pada ekosistem Next.js dan Vercel Serverless.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}