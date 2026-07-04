// File: app/page.tsx
'use client';

import React, { useState } from 'react';
import MainApp from '../components/MainApp';
import UserGuide from '../components/UserGuide';
import Methodology from '../components/Methodology';
import AboutTeam from '../components/AboutTeam';

export default function Home() {
  const [currentView, setCurrentView] = useState<'app' | 'guide' | 'methodology' | 'about'>('app');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="shrink-0 flex items-center cursor-pointer" onClick={() => setCurrentView('app')}>
                <span className="text-2xl mr-2">🩺</span>
                <span className="font-black text-red-900 text-xl tracking-tight">ChirroSmart AI</span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <button onClick={() => setCurrentView('app')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold ${currentView === 'app' ? 'border-red-800 text-red-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} transition-colors`}>
                  Kalkulator Klinis
                </button>
                <button onClick={() => setCurrentView('guide')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold ${currentView === 'guide' ? 'border-red-800 text-red-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} transition-colors`}>
                  Panduan
                </button>
                <button onClick={() => setCurrentView('methodology')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold ${currentView === 'methodology' ? 'border-red-800 text-red-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} transition-colors`}>
                  Metodologi & Referensi
                </button>
                <button onClick={() => setCurrentView('about')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold ${currentView === 'about' ? 'border-red-800 text-red-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} transition-colors`}>
                  Tim Peneliti
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className="md:hidden flex overflow-x-auto border-t border-gray-100 bg-gray-50/50">
           <button onClick={() => setCurrentView('app')} className={`px-4 py-3 text-xs font-bold whitespace-nowrap ${currentView === 'app' ? 'text-red-900 bg-white border-b-2 border-red-800' : 'text-gray-500'}`}>Kalkulator</button>
           <button onClick={() => setCurrentView('guide')} className={`px-4 py-3 text-xs font-bold whitespace-nowrap ${currentView === 'guide' ? 'text-red-900 bg-white border-b-2 border-red-800' : 'text-gray-500'}`}>Panduan</button>
           <button onClick={() => setCurrentView('methodology')} className={`px-4 py-3 text-xs font-bold whitespace-nowrap ${currentView === 'methodology' ? 'text-red-900 bg-white border-b-2 border-red-800' : 'text-gray-500'}`}>Metodologi</button>
           <button onClick={() => setCurrentView('about')} className={`px-4 py-3 text-xs font-bold whitespace-nowrap ${currentView === 'about' ? 'text-red-900 bg-white border-b-2 border-red-800' : 'text-gray-500'}`}>Tim</button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <div className="flex-grow">
        {currentView === 'app' && <MainApp />}
        {currentView === 'guide' && <UserGuide />}
        {currentView === 'methodology' && <Methodology />}
        {currentView === 'about' && <AboutTeam />}
      </div>

      {/* GLOBAL FOOTER & MEDICAL DISCLAIMER */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-6 shadow-inner">
            <h4 className="text-amber-900 font-extrabold text-sm uppercase tracking-wider mb-2 flex items-center">
              <span className="text-lg mr-2">⚠️</span> Sanggahan Medis (Medical Disclaimer)
            </h4>
            <p className="text-amber-800 text-sm leading-relaxed text-justify">
              Aplikasi <i>Clinical Decision Support System</i> (CDSS) ini merupakan instrumen purwarupa yang dikembangkan untuk tujuan riset akademis dan <b>TIDAK</b> ditujukan sebagai pengganti dari penilaian, diagnosis, maupun saran medis profesional. Seluruh hasil prediksi kecerdasan buatan (probabilitas mortalitas/LoS) maupun rekomendasi dosis yang dihasilkan oleh sistem (<i>rule engine</i>) wajib dianalisis ulang. Keputusan akhir mengenai tata laksana farmakoterapi dan penyesuaian dosis obat tetap mutlak berada di tangan Dokter Penanggung Jawab Pelayanan (DPJP) dan Apoteker Klinis yang menangani pasien.
            </p>
          </div>
          <div className="text-center text-sm text-gray-500 font-medium">
            <p>&copy; {new Date().getFullYear()} ChirroSmart AI Research Project. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}