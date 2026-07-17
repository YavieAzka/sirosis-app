// File: components/MortalityPredictor.tsx
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { CtpParams, hitungSkorCtp, hitungGfrCkdEpi } from '../utils/clinical';
import CtpCalculator from './CtpCalculator';

type ShapContribution = { feature: string; contribution: number; value_input: number };
type PredictionResultMort = { 
  probability: number; 
  predicted_class: number; 
  base_value: number; 
  shap_contributions: ShapContribution[] 
};

const FEATURE_LABELS: Record<string, string> = {
  komor_sepsis: 'Sepsis', urea_baseline: 'Urea Baseline', natrium_baseline: 'Natrium Baseline',
  komp_eh: 'Ensefalopati Hepatikum', inr_baseline: 'INR', sgot_baseline: 'SGOT Baseline',
  gfr: 'GFR (CKD-EPI)', ctp_encoded: 'Kelas CTP'
};

export default function MortalityPredictor() {
  const [tokenInput, setTokenInput] = useState('');
  const [formDataMort, setFormDataMort] = useState({
    komor_sepsis: 0, urea_baseline: '', natrium_baseline: '',
    komp_eh: 0, inr_baseline: '', sgot_baseline: '', gfr: '', ctp_encoded: 1,
  });
  
  const [loadingMort, setLoadingMort] = useState(false);
  const [resultMort, setResultMort] = useState<PredictionResultMort | null>(null);
  const [showModalMort, setShowModalMort] = useState(false);
  const [showDetailsMort, setShowDetailsMort] = useState(false);
  const [savingMort, setSavingMort] = useState(false);

  const [autoGfrMort, setAutoGfrMort] = useState(false);
  const [gfrParamsMort, setGfrParamsMort] = useState({ scr: '', age: '', gender: 'L' });

  useEffect(() => {
    if (autoGfrMort && gfrParamsMort.scr && gfrParamsMort.age) {
      const scr = parseFloat(gfrParamsMort.scr);
      const age = parseFloat(gfrParamsMort.age);
      if (!isNaN(scr) && !isNaN(age) && scr > 0 && age > 0) {
        setFormDataMort(prev => ({ ...prev, gfr: hitungGfrCkdEpi(scr, age, gfrParamsMort.gender as 'L'|'P') }));
      }
    }
  }, [autoGfrMort, gfrParamsMort]);

  const [autoCtpMort, setAutoCtpMort] = useState(false);
  const [ctpParamsMort, setCtpParamsMort] = useState<CtpParams>({
    bilirubin: '', albumin: '', inr: '', ascites: '', encephalopathy: '',
  });
  const skorCtpMort = hitungSkorCtp(ctpParamsMort);

  useEffect(() => {
    if (autoCtpMort && skorCtpMort) {
      const ctpEncodedMap: Record<'A' | 'B' | 'C', number> = { A: 1, B: 2, C: 3 };
      const ctpEncodedBaru = ctpEncodedMap[skorCtpMort.kelas];
      const komplEhBaru = Number(ctpParamsMort.encephalopathy) >= 2 ? 1 : 0;
      setFormDataMort(prev => {
        if (prev.ctp_encoded === ctpEncodedBaru && prev.komp_eh === komplEhBaru) return prev;
        return { ...prev, ctp_encoded: ctpEncodedBaru, komp_eh: komplEhBaru };
      });
    }
  }, [autoCtpMort, skorCtpMort?.kelas, ctpParamsMort.encephalopathy]);

  const handlePredictMortalitas = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMort(true);
    setShowDetailsMort(false);
    
    const payload = { ...formDataMort, 
      komor_sepsis: Number(formDataMort.komor_sepsis), urea_baseline: Number(formDataMort.urea_baseline),
      natrium_baseline: Number(formDataMort.natrium_baseline), komp_eh: Number(formDataMort.komp_eh),
      inr_baseline: Number(formDataMort.inr_baseline), sgot_baseline: Number(formDataMort.sgot_baseline),
      gfr: Number(formDataMort.gfr), ctp_encoded: Number(formDataMort.ctp_encoded),
    };

    try {
      const res = await fetch('/api/predict', { method: 'POST', body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.probability !== undefined) { setResultMort(data); setShowModalMort(true); } 
      else { alert(data.error || 'Terjadi kesalahan internal.'); }
    } catch (error) { alert('Gagal menghubungi server AI.'); } 
    finally { setLoadingMort(false); }
  };

  const handleSaveToDatabaseMort = async () => {
    if (!tokenInput) { alert("Masukkan Token Rahasia terlebih dahulu!"); return; }
    setSavingMort(true);
    const payload = {
      ...formDataMort,
      komor_sepsis: Number(formDataMort.komor_sepsis), komp_eh: Number(formDataMort.komp_eh),
      urea_baseline: Number(formDataMort.urea_baseline), natrium_baseline: Number(formDataMort.natrium_baseline),
      inr_baseline: Number(formDataMort.inr_baseline), sgot_baseline: Number(formDataMort.sgot_baseline),
      gfr: Number(formDataMort.gfr), ctp_encoded: Number(formDataMort.ctp_encoded),
      probability: resultMort?.probability, token: tokenInput
    };

    try {
      const res = await fetch('/database/save', { 
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) 
      });
      const data = await res.json();
      if (res.ok) { alert('Data Mortalitas berhasil disimpan!'); setShowModalMort(false); setTokenInput(''); } 
      else { alert(data.error || 'Gagal menyimpan. Pastikan token benar.'); }
    } catch (error) { alert('Gagal menghubungi database.'); } 
    finally { setSavingMort(false); }
  };

  return (
    <div className="animate-fade-in">
        <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-800 p-8 text-center shadow-inner">
        <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">Kalkulator Prognosis Sirosis Hati</h1>
        </div>
        
        <form onSubmit={handlePredictMortalitas} className="p-8 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2"><label className="block text-sm font-bold text-gray-700">Status Sepsis</label>
            <select className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800" value={formDataMort.komor_sepsis} onChange={(e) => setFormDataMort({...formDataMort, komor_sepsis: Number(e.target.value)})}>
                <option value={0}>Tidak Ada (0)</option><option value={1}>Ya, Sepsis (1)</option>
            </select>
            </div>
            <div className="space-y-2"><label className="block text-sm font-bold text-gray-700">Ensefalopati Hepatikum</label>
            <select className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800" value={formDataMort.komp_eh} onChange={(e) => setFormDataMort({...formDataMort, komp_eh: Number(e.target.value)})}>
                <option value={0}>Tidak Ada (0)</option><option value={1}>Ya (1)</option>
            </select>
            </div>
            
            <div className="col-span-1 md:col-span-2">
            <CtpCalculator active={autoCtpMort} onToggle={setAutoCtpMort} params={ctpParamsMort} onChangeParam={(key, value) => setCtpParamsMort(prev => ({ ...prev, [key]: value }))} hasil={skorCtpMort}>
                <div className="space-y-2 mt-4 border-t border-gray-200 pt-4">
                    <label className="block text-sm font-bold text-gray-700">Skor CTP (Input Manual)</label>
                    <select 
                        className={`w-full border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800 transition-all ${autoCtpMort ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-inner' : 'bg-white text-gray-900'}`} 
                        value={formDataMort.ctp_encoded} disabled={autoCtpMort}
                        onChange={(e) => !autoCtpMort && setFormDataMort({...formDataMort, ctp_encoded: Number(e.target.value)})}
                    >
                        <option value={1}>Kelas A</option><option value={2}>Kelas B</option><option value={3}>Kelas C</option>
                    </select>
                </div>
            </CtpCalculator>
            </div>
            
            {[ 
            {id: 'urea_baseline', label: 'Urea Baseline (mg/dL)', ph: 'Contoh: 25.5'}, 
            {id: 'natrium_baseline', label: 'Natrium Baseline (mEq/L)', ph: 'Contoh: 138.0'}, 
            {id: 'inr_baseline', label: 'INR Baseline', ph: 'Contoh: 1.2'}, 
            {id: 'sgot_baseline', label: 'SGOT Baseline (U/L)', ph: 'Contoh: 45.5'}
            ].map((f) => (
            <div key={f.id} className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">{f.label}</label>
                <input type="number" step="any" required className="w-full bg-white border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800" placeholder={f.ph} value={(formDataMort as any)[f.id]} onChange={(e) => setFormDataMort({...formDataMort, [f.id]: e.target.value})} />
            </div>
            ))}

            <div className="col-span-1 md:col-span-2 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm mt-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                <label className="text-sm font-bold text-gray-700">Nilai GFR / CKD-EPI (mL/min)</label>
                <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800" checked={autoGfrMort} onChange={(e) => setAutoGfrMort(e.target.checked)} />
                <span className="text-xs font-bold text-red-900">Hitung Otomatis (CKD-EPI 2021)</span>
                </label>
            </div>
            {autoGfrMort && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-white rounded-xl border border-red-100 shadow-inner">
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Serum Kreatinin (mg/dL)</label>
                    <input type="number" step="any" required={autoGfrMort} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-800 focus:border-red-800 bg-white" placeholder="Contoh: 1.1" value={gfrParamsMort.scr} onChange={e => setGfrParamsMort({...gfrParamsMort, scr: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Usia (Tahun)</label>
                    <input type="number" step="any" required={autoGfrMort} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-800 focus:border-red-800 bg-white" placeholder="Contoh: 45" value={gfrParamsMort.age} onChange={e => setGfrParamsMort({...gfrParamsMort, age: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Jenis Kelamin</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-800 focus:border-red-800 bg-white" value={gfrParamsMort.gender} onChange={e => setGfrParamsMort({...gfrParamsMort, gender: e.target.value})}>
                    <option value="L">Laki-laki</option><option value="P">Perempuan</option>
                    </select>
                </div>
                </div>
            )}
            <input type="number" step="any" required 
                className={`w-full border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800 transition-all ${autoGfrMort ? 'bg-gray-100 text-red-900 font-bold cursor-not-allowed shadow-inner' : 'bg-white text-gray-900'}`}
                placeholder={autoGfrMort ? "Otomatis terkalkulasi..." : "Contoh: 85.5"}
                value={formDataMort.gfr} readOnly={autoGfrMort} onChange={(e) => !autoGfrMort && setFormDataMort({...formDataMort, gfr: e.target.value})} />
            </div>
        </div>
        <button type="submit" disabled={loadingMort} className="w-full mt-10 bg-red-800 hover:bg-red-900 text-white font-bold py-4 rounded-xl shadow-lg transition-all">{loadingMort ? 'Mengkalkulasi...' : 'Analisis Probabilitas Mortalitas'}</button>
        </form>

        {/* Modal Result Mortalitas */}
        {showModalMort && resultMort !== null && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden my-8 border border-gray-100">
              <div className="bg-red-900 p-5 text-center"><h2 className="text-xl font-bold text-white tracking-wide">Laporan Keputusan AI</h2></div>
              <div className="p-8">
                <div className={`text-center py-8 rounded-2xl mb-6 border shadow-inner ${resultMort.probability >= 0.4 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <p className="text-gray-600 font-bold mb-2 uppercase tracking-widest text-xs">Probabilitas Kematian</p>
                  <p className={`text-6xl font-black tracking-tight mb-2 ${resultMort.probability >= 0.4 ? 'text-red-700' : 'text-emerald-600'}`}>
                    {(resultMort.probability * 100).toFixed(1)}<span className="text-4xl">%</span>
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${resultMort.predicted_class === 1 ? 'bg-red-200 text-red-900' : 'bg-emerald-200 text-emerald-900'}`}>
                    AI Label: {resultMort.predicted_class === 1 ? 'High Risk / Mortalitas' : 'Survive'}
                  </span>
                </div>
                
                <button onClick={() => setShowDetailsMort(!showDetailsMort)} className="w-full text-center text-sm font-bold text-gray-500 hover:text-red-800 mb-6 flex justify-center items-center gap-1.5 transition-colors">
                  {showDetailsMort ? 'Sembunyikan Analisis Klinis (SHAP)' : 'Lihat Detail Analisis Klinis AI'}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showDetailsMort ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                </button>

                {showDetailsMort && (
                  <div className="mb-6 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in shadow-inner overflow-hidden">
                    <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <p className="font-extrabold text-gray-700 uppercase tracking-wider text-[10px]">Kontributor Risiko (Faktor Predominan)</p>
                        <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded text-gray-500 border border-gray-200">SHAP.TreeExplainer</span>
                    </div>
                    <div className="p-4 space-y-3">
                        {resultMort.shap_contributions.map((shap, idx) => {
                           const isPositive = shap.contribution > 0;
                           const impactValue = (Math.abs(shap.contribution) * 100).toFixed(1);
                           const humanLabel = FEATURE_LABELS[shap.feature] || shap.feature;
                           return (
                             <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                               <div className="flex flex-col">
                                  <span className="font-bold text-gray-800 text-sm">{humanLabel}</span>
                                  <span className="text-xs text-gray-500 font-medium">Input pasien: <span className="font-mono bg-gray-100 px-1 rounded">{shap.value_input}</span></span>
                               </div>
                               <span className={`px-2.5 py-1 rounded text-xs font-black min-w-[60px] text-center border ${isPositive ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                                 {isPositive ? '+' : '-'}{impactValue}%
                               </span>
                             </div>
                           );
                        })}
                    </div>
                  </div>
                )}

                <div className="mb-5 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider text-center">Otorisasi Simpan Data</label>
                  <input type="password" placeholder="Masukkan Token Rahasia" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-800 focus:border-red-800 text-center tracking-widest bg-white" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} />
                </div>

                <div className="flex gap-3">
                  <button onClick={() => {setShowModalMort(false); setTokenInput('');}} className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 py-3 rounded-xl font-bold transition-colors">Tutup</button>
                  <button onClick={handleSaveToDatabaseMort} disabled={savingMort} className="flex-1 bg-red-800 hover:bg-red-900 text-white py-3 rounded-xl font-bold shadow-md transition-all">{savingMort ? 'Menyimpan...' : 'Simpan ke Database'}</button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}