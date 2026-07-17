// File: components/AboutTeam.tsx
import React from 'react';
import { Mail } from 'lucide-react';

export default function AboutTeam() {
  // Array data placeholder untuk 4 Promotor
  const promotors = [
    { id: 1, name: 'Prof. apt. Fatma Sri Wahyuni, Ph.D', role: 'Clinical Domain Expert' },
    { id: 2, name: 'apt. Yelly Oktavia Sari, M.Pharm, Ph.D', role: 'Clinical Domain Expert' },
    { id: 3, name: 'Dr. dr. Saptino Miro, Sp.PD, Subsp. G.E.H(K), FINASIM', role: 'Gastroenterologist, Hepatologist' },
    { id: 4, name: 'Dr. apt, Hansen Nasif, S.Si, Sp. FRS', role: 'Clnical Domain Expert' }
  ];

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
          
          {/* ========================================== */}
          {/* KESELURUHAN TIM (6 ORANG) */}
          {/* ========================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-stretch">
            
            {/* URUTAN 1: PENELITI UTAMA (SERDIANI) */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-red-50 shadow-lg mb-6 relative transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <img 
                  src="/images/serdiani.jpeg" 
                  alt="Peneliti Medis" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-150 scale-140"
                  onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=Serdiani&background=fecaca&color=7f1d1d&size=200'; }}
                />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-1">
                apt. Serdiani, S.Si, M.Farm
              </h3>
              <p className="text-red-800 font-bold text-xs uppercase tracking-widest mb-1">
                Clinical Domain Expert
              </p>
              <p className="text-gray-500 font-semibold text-sm mb-6">
                Fakultas Farmasi, Universitas Andalas
              </p>
              
              <a 
                href="mailto:serdiani.farmasi1@gmail.com?subject=Pertanyaan Klinis: CDSS Hepatology" 
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 text-red-800 hover:bg-red-800 hover:text-white rounded-full text-sm font-bold transition-colors duration-300 shadow-sm border border-red-100 mt-auto"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>

            {/* URUTAN 2 - 5: TIM PROMOTOR (MAPPING DATA) */}
            {promotors.map((person) => (
              <div key={person.id} className="flex flex-col items-center text-center group">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-50 shadow-lg mb-6 relative transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:border-red-50">
                  <img 
                    src={`/images/promotor-${person.id}.jpeg`} 
                    alt={`Promotor ${person.id}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=Promotor+${person.id}&background=f87171&color=ffffff&size=200`; }}
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-1">
                  {person.name}
                </h3>
                <p className="text-red-800 font-bold text-xs uppercase tracking-widest mb-1">
                  {person.role}
                </p>
                <p className="text-gray-500 font-semibold text-sm">
                  Universitas Andalas
                </p>
              </div>
            ))}

            {/* URUTAN 6: AI ENGINEER (ANDA) */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-red-50 shadow-lg mb-6 relative transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <img 
                  src="/images/yavie.jpg" 
                  alt="Yavie Azka Putra Araly" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=Yavie+Azka&background=fee2e2&color=991b1b&size=200'; }}
                />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-1">
                Yavie Azka Putra Araly
              </h3>
              <p className="text-red-800 font-bold text-xs uppercase tracking-widest mb-1">
                AI & Software Engineer
              </p>
              <p className="text-gray-500 font-semibold text-sm mb-6">
                Teknik Informatika, Institut Teknologi Bandung
              </p>

              <a 
                href="mailto:yavieazkaputra@gmail.com?subject=Pertanyaan Teknis/AI: CDSS Hepatology" 
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 text-red-800 hover:bg-red-800 hover:text-white rounded-full text-sm font-bold transition-colors duration-300 shadow-sm border border-red-100 mt-auto"
              >
                <Mail className="w-4 h-4" />
                Email
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