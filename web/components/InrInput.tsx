// File: components/InrInput.tsx
import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

interface InrInputProps {
  onInrChange: (inr: number | null) => void;
}

export default function InrInput({ onInrChange }: InrInputProps) {
  const [mode, setMode] = useState<'direct' | 'calculate'>('direct');
  
  const [directInr, setDirectInr] = useState<string>('');
  
  const [ptPatient, setPtPatient] = useState<string>('');
  const [ptNormal, setPtNormal] = useState<string>('');
  const [isi, setIsi] = useState<string>('1.0'); 
  const [calculatedInr, setCalculatedInr] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'calculate') {
      const pt = parseFloat(ptPatient);
      const ptNorm = parseFloat(ptNormal);
      const isiVal = parseFloat(isi);

      if (!isNaN(pt) && !isNaN(ptNorm) && !isNaN(isiVal) && ptNorm > 0) {
        const result = Math.pow((pt / ptNorm), isiVal);
        const roundedResult = result.toFixed(2);
        setCalculatedInr(roundedResult);
        onInrChange(parseFloat(roundedResult));
      } else {
        setCalculatedInr(null);
        onInrChange(null);
      }
    }
  }, [ptPatient, ptNormal, isi, mode, onInrChange]);

  const handleDirectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDirectInr(val);
    const parsed = parseFloat(val);
    onInrChange(!isNaN(parsed) ? parsed : null);
  };

  return (
    // Menggunakan bg-gray-50 agar senada dengan CTP dan GFR
    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm w-full mt-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        <label className="text-sm font-bold text-gray-700">
          International Normalized Ratio (INR)
        </label>
        
        {/* Toggle Mode */}
        <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          <label className={`flex items-center space-x-1.5 cursor-pointer px-3 py-1.5 rounded-md transition-colors ${mode === 'direct' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
            <input 
              type="radio" name="inrMode" value="direct" 
              checked={mode === 'direct'} 
              onChange={() => {
                setMode('direct');
                onInrChange(parseFloat(directInr) || null);
              }} 
              className="text-red-800 focus:ring-red-800 w-3.5 h-3.5"
            />
            <span className="text-[11px] font-bold text-gray-700 uppercase">Input Langsung</span>
          </label>
          <label className={`flex items-center space-x-1.5 cursor-pointer px-3 py-1.5 rounded-md transition-colors ${mode === 'calculate' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
            <input 
              type="radio" name="inrMode" value="calculate" 
              checked={mode === 'calculate'} 
              onChange={() => {
                setMode('calculate');
                onInrChange(calculatedInr ? parseFloat(calculatedInr) : null);
              }} 
              className="text-red-800 focus:ring-red-800 w-3.5 h-3.5"
            />
            <span className="text-[11px] font-bold text-gray-700 uppercase">Hitung dari PT</span>
          </label>
        </div>
      </div>

      {mode === 'direct' && (
        <div>
          <input 
            type="number" step="0.01"
            placeholder="Contoh: 1.2"
            value={directInr}
            onChange={handleDirectChange}
            className="w-full border border-gray-300 bg-white rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-red-800 focus:border-red-800"
          />
        </div>
      )}

      {mode === 'calculate' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 p-4 bg-white rounded-xl border border-red-100 shadow-inner">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">PT Pasien (detik)</label>
            <input 
              type="number" step="0.1" placeholder="Contoh: 14.5"
              value={ptPatient} onChange={(e) => setPtPatient(e.target.value)}
              className="w-full border border-gray-300 bg-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-800 focus:border-red-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">PT Normal/Kontrol (detik)</label>
            <input 
              type="number" step="0.1" placeholder="Contoh: 12.0"
              value={ptNormal} onChange={(e) => setPtNormal(e.target.value)}
              className="w-full border border-gray-300 bg-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-800 focus:border-red-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Nilai ISI Reagen</label>
            <input 
              type="number" step="0.01"
              value={isi} onChange={(e) => setIsi(e.target.value)}
              className="w-full border border-gray-300 bg-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-800 focus:border-red-800"
            />
          </div>
          
          <div className="col-span-1 md:col-span-3 flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-200 shadow-sm mt-1">
            <div className="flex items-center gap-2 text-red-900">
              <Calculator className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Hasil Kalkulasi INR:</span>
            </div>
            <div className="text-lg font-black text-red-900">
              {calculatedInr !== null ? calculatedInr : '--'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}