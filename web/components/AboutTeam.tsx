// File: components/AboutTeam.tsx
import React from 'react';
import { Mail } from 'lucide-react';

export default function AboutTeam() {
  return (
    <div className="py-12 px-4 flex justify-center animate-fade-in">
      <div className="max-w-5xl w-full">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-800 p-8 md:p-12 rounded-t-3xl text-center shadow-inner">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md mb-2">
            Tim Peneliti & Pengembang
          </h1>
        </div>

        {/* Content Section */}
        <div className="bg-white p-8 md:p-12 shadow-2xl border border-gray-100 border-t-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
            
            {/* ========================================== */}
            {/* PROFIL 1: DOMAIN EXPERT (MEDIS) */}
            {/* ========================================== */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-red-50 shadow-lg mb-6 relative transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                {/* Ganti 'foto-rekan.jpg' dengan nama file asli di folder public/images/ */}
                <img 
                  src="/images/serdiani.jpeg" 
                  alt="Peneliti Medis" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-150 scale-140"
                  onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=Tim+Medis&background=fecaca&color=7f1d1d&size=200'; }}
                />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
                Serdiani
              </h3>
              <p className="text-red-800 font-bold text-xs uppercase tracking-widest mb-1">
                Clinical Domain Expert
              </p>
              <p className="text-gray-500 font-semibold text-sm mb-4">
                Fakultas Farmasi, Universitas Andalas
              </p>
              <p className="text-gray-600 text-sm leading-relaxed px-2 md:px-6 mb-6">
                Bertanggung jawab sebagai peneliti utama, penetapan <i>cut-off point</i> diagnostik, serta penetapan aturan untuk <i>rule-engine</i> rekomendasi farmakoterapi berbasis literatur hepatologi terkini.
              </p>
              
              {/* Tombol Kontak Email (Medis) */}
              <a 
                href="mailto:serdiani.farmasi1@gmail.com?subject=Pertanyaan Klinis: CDSS Hepatology" 
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 text-red-800 hover:bg-red-800 hover:text-white rounded-full text-sm font-bold transition-colors duration-300 shadow-sm border border-red-100"
              >
                <Mail className="w-4 h-4" />
                serdiani.farmasi1@gmail.com
              </a>
            </div>

            {/* ========================================== */}
            {/* PROFIL 2: AI & SOFTWARE ENGINEER */}
            {/* ========================================== */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-red-50 shadow-lg mb-6 relative transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                {/* Ganti 'yavie.jpg' dengan nama file asli di folder public/images/ */}
                <img 
                  src="/images/yavie.jpeg" 
                  alt="Yavie Azka Putra Araly" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=Yavie+Azka&background=fee2e2&color=991b1b&size=200'; }}
                />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
                Yavie Azka Putra Araly
              </h3>
              <p className="text-red-800 font-bold text-xs uppercase tracking-widest mb-1">
                AI & Software Engineer
              </p>
              <p className="text-gray-500 font-semibold text-sm mb-4">
                Teknik Informatika, Institut Teknologi Bandung
              </p>
              <p className="text-gray-600 text-sm leading-relaxed px-2 md:px-6 mb-6">
                Bertanggung jawab atas pengembangan arsitektur aplikasi, pelatihan dan deployment model <i>Machine Learning</i> (Random Forest/XGBoost), implementasi <i>Explainable AI</i> (SHAP), serta integrasi <i>user interface</i> sistem.
              </p>

              {/* Tombol Kontak Email (Engineer) */}
              <a 
                href="mailto:yavieazkaputra@gmail.com?subject=Pertanyaan Teknis/AI: CDSS Hepatology" 
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 text-red-800 hover:bg-red-800 hover:text-white rounded-full text-sm font-bold transition-colors duration-300 shadow-sm border border-red-100"
              >
                <Mail className="w-4 h-4" />
                yavieazkaputra@gmail.com
              </a>
            </div>

          </div>
        </div>

        {/* ========================================== */}
        {/* BAGIAN KONTAK UMUM / DUKUNGAN */}
        {/* ========================================== */}
        <div className="bg-gray-50 p-8 rounded-b-3xl border border-gray-100 text-center flex flex-col items-center">
            <div className="bg-white p-4 rounded-full shadow-sm border border-gray-200 mb-4">
                <Mail className="w-8 h-8 text-red-800" />
            </div>
            <h4 className="text-lg font-extrabold text-gray-900 mb-2">Dukungan & Kolaborasi</h4>
            <p className="text-gray-600 text-sm max-w-xl mb-6">
                Apakah Anda memiliki pertanyaan umum terkait proyek riset ini, menemukan masalah (<i>bug</i>) pada aplikasi, atau tertarik untuk berkolaborasi lebih lanjut? Jangan ragu untuk mengirimkan pesan kepada kami.
            </p>
            <a 
                href="mailto:yavieazkaputra@gmail.com?subject=Kolaborasi/Dukungan: CDSS Hepatology" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-900 hover:bg-red-950 text-white rounded-xl font-bold transition-all duration-300 shadow-lg active:scale-95"
            >
                <Mail className="w-5 h-5" />
                Kirim Email ke Tim Riset
            </a>
        </div>
      </div>
    </div>
  );
}