// File: components/MainApp.tsx
import React, { useState } from 'react';
import { HeartPulse, Hospital, Pill } from 'lucide-react';
import MortalityPredictor from './MortalityPredictor';
import LosPredictor from './LosPredictor';
import DoseRecommender from './DoseRecommender';

export default function MainApp() {
  const [activeTab, setActiveTab] = useState<'mortalitas' | 'los' | 'dosis'>('mortalitas');

  return (
    <div className="py-8 px-4 flex flex-col items-center animate-fade-in">
      {/* TABS HEADER */}
      <div className="flex flex-col md:flex-row gap-2 mb-6 max-w-5xl w-full">
        
        <button 
          type="button"
          onClick={() => setActiveTab('mortalitas')} 
          className={`group flex-1 flex items-center justify-center gap-2 py-4 text-center rounded-2xl md:rounded-b-none md:rounded-t-2xl font-bold transition-all duration-300 active:scale-95 ${
            activeTab === 'mortalitas' 
              ? 'bg-red-900 text-white shadow-lg' 
              : 'bg-white text-gray-500 hover:bg-red-50 hover:text-red-900 border border-gray-200 border-b-0'
          }`}
        >
          <HeartPulse className={`w-5 h-5 pointer-events-none transition-transform duration-300 ${activeTab === 'mortalitas' ? 'animate-pulse' : 'group-hover:scale-125'}`} />
          AI Prediksi Mortalitas
        </button>

        <button 
          type="button"
          onClick={() => setActiveTab('los')} 
          className={`group flex-1 flex items-center justify-center gap-2 py-4 text-center rounded-2xl md:rounded-b-none md:rounded-t-2xl font-bold transition-all duration-300 active:scale-95 ${
            activeTab === 'los' 
              ? 'bg-red-900 text-white shadow-lg' 
              : 'bg-white text-gray-500 hover:bg-red-50 hover:text-red-900 border border-gray-200 border-b-0'
          }`}
        >
          <Hospital className={`w-5 h-5 pointer-events-none transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110`} />
          AI Prediksi Lama Rawat
        </button>

        <button 
          type="button"
          onClick={() => setActiveTab('dosis')} 
          className={`group flex-1 flex items-center justify-center gap-2 py-4 text-center rounded-2xl md:rounded-b-none md:rounded-t-2xl font-bold transition-all duration-300 active:scale-95 ${
            activeTab === 'dosis' 
              ? 'bg-red-900 text-white shadow-lg' 
              : 'bg-white text-gray-500 hover:bg-red-50 hover:text-red-900 border border-gray-200 border-b-0'
          }`}
        >
          <Pill className={`w-5 h-5 pointer-events-none transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110`} />
          Rekomendasi Dosis Klinis
        </button>
      </div>

      {/* RENDER KOMPONEN BERDASARKAN TAB AKTIF */}
      <div className="max-w-5xl w-full bg-white rounded-3xl md:rounded-t-none shadow-2xl overflow-hidden border border-gray-100">
        {activeTab === 'mortalitas' && <MortalityPredictor />}
        {activeTab === 'los' && <LosPredictor />}
        {activeTab === 'dosis' && <DoseRecommender />}
      </div>
    </div>
  );
}