// File: app/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import MainApp from '../components/MainApp';
import UserGuide from '../components/UserGuide';
import Methodology from '../components/Methodology';
import AboutTeam from '../components/AboutTeam';

type ViewType = 'app' | 'guide' | 'methodology' | 'about';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('app');

  // ==========================================
  // STATE & REFS UNTUK SLIDING NAVBAR
  // ==========================================
  const desktopRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  const [desktopIndicator, setDesktopIndicator] = useState({ left: 0, width: 0 });
  const [mobileIndicator, setMobileIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const updateIndicator = () => {
      // Peta indeks untuk mencari tab mana yang sedang aktif
      const viewToIndex: Record<string, number> = { app: 0, guide: 1, methodology: 2, about: 3 };
      const index = viewToIndex[currentView];
      
      // Hitung posisi (left) dan lebar (width) untuk desktop
      const desktopEl = desktopRefs.current[index];
      if (desktopEl) {
        setDesktopIndicator({ left: desktopEl.offsetLeft, width: desktopEl.offsetWidth });
      }
      
      // Hitung posisi (left) dan lebar (width) untuk perangkat mobile (scrollable)
      const mobileEl = mobileRefs.current[index];
      if (mobileEl) {
        setMobileIndicator({ left: mobileEl.offsetLeft, width: mobileEl.offsetWidth });
      }
    };

    // Jalankan kalkulasi saat render awal dan saat menu ditekan
    updateIndicator();
    
    // Dengarkan event resize layar agar garis tidak meleset saat ukuran browser diubah
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [currentView]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      
      {/* =================================================================== */}
      {/* NAVBAR */}
      {/* =================================================================== */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center w-full">
              
              {/* Logo / Judul */}
              <div 
                className="shrink-0 flex items-center cursor-pointer mr-8" 
                onClick={() => setCurrentView('app')}
              >
                <span className="font-black text-red-900 text-xl tracking-tight">CirrhoSmartAI</span>
              </div>
              
              {/* Menu Desktop */}
              <div className="hidden md:flex relative h-full">
                <button 
                  ref={el => { desktopRefs.current[0] = el; }} 
                  onClick={() => setCurrentView('app')} 
                  className={`inline-flex items-center px-4 h-full text-sm font-bold transition-colors duration-300 z-10 ${currentView === 'app' ? 'text-red-900' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  Kalkulator Klinis
                </button>
                <button 
                  ref={el => { desktopRefs.current[1] = el; }} 
                  onClick={() => setCurrentView('guide')} 
                  className={`inline-flex items-center px-4 h-full text-sm font-bold transition-colors duration-300 z-10 ${currentView === 'guide' ? 'text-red-900' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  Panduan
                </button>
                <button 
                  ref={el => { desktopRefs.current[2] = el; }} 
                  onClick={() => setCurrentView('methodology')} 
                  className={`inline-flex items-center px-4 h-full text-sm font-bold transition-colors duration-300 z-10 ${currentView === 'methodology' ? 'text-red-900' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  Metodologi & Referensi
                </button>
                <button 
                  ref={el => { desktopRefs.current[3] = el; }} 
                  onClick={() => setCurrentView('about')} 
                  className={`inline-flex items-center px-4 h-full text-sm font-bold transition-colors duration-300 z-10 ${currentView === 'about' ? 'text-red-900' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  Tim Peneliti
                </button>

                {/* Indikator Slider (Desktop) */}
                <div 
                  className="absolute bottom-0 h-0.5 bg-red-800 transition-all duration-300 ease-out" 
                  style={{ left: desktopIndicator.left, width: desktopIndicator.width }} 
                />
              </div>

            </div>
          </div>
        </div>
        
        {/* Menu Mobile (Scrollable secara horizontal) */}
        <div className="md:hidden overflow-x-auto border-t border-gray-100 bg-gray-50/80 backdrop-blur">
          <div className="flex relative w-max min-w-full">
            <button 
              ref={el => { mobileRefs.current[0] = el; }} 
              onClick={() => setCurrentView('app')} 
              className={`px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-colors duration-300 z-10 ${currentView === 'app' ? 'text-red-900' : 'text-gray-500'}`}
            >
              Kalkulator
            </button>
            <button 
              ref={el => { mobileRefs.current[1] = el; }} 
              onClick={() => setCurrentView('guide')} 
              className={`px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-colors duration-300 z-10 ${currentView === 'guide' ? 'text-red-900' : 'text-gray-500'}`}
            >
              Panduan
            </button>
            <button 
              ref={el => { mobileRefs.current[2] = el; }} 
              onClick={() => setCurrentView('methodology')} 
              className={`px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-colors duration-300 z-10 ${currentView === 'methodology' ? 'text-red-900' : 'text-gray-500'}`}
            >
              Metodologi
            </button>
            <button 
              ref={el => { mobileRefs.current[3] = el; }} 
              onClick={() => setCurrentView('about')} 
              className={`px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-colors duration-300 z-10 ${currentView === 'about' ? 'text-red-900' : 'text-gray-500'}`}
            >
              Tim
            </button>

            {/* Indikator Slider (Mobile) */}
            <div 
              className="absolute bottom-0 h-0.5 bg-red-800 transition-all duration-300 ease-out z-20" 
              style={{ left: mobileIndicator.left, width: mobileIndicator.width }} 
            />
          </div>
        </div>
      </nav>

      {/* =================================================================== */}
      {/* KONTEN UTAMA */}
      {/* =================================================================== */}
      <div className="flex-grow">
        {currentView === 'app' && <MainApp />}
        {currentView === 'guide' && <UserGuide />}
        {currentView === 'methodology' && <Methodology />}
        {currentView === 'about' && <AboutTeam />}
      </div>

      {/* =================================================================== */}
      {/* GLOBAL FOOTER & MEDICAL DISCLAIMER */}
      {/* =================================================================== */}
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
            <p>&copy; {new Date().getFullYear()} CirrhoSmartAI Research Project. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}