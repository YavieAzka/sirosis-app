// File: components/MainApp.tsx
import React, { useState, useEffect } from 'react';
import { CtpParams, hitungSkorCtp, hitungGfrCkdEpi } from '../utils/clinical';
import CtpCalculator from './CtpCalculator';

export default function MainApp() {
  const [activeTab, setActiveTab] = useState<'mortalitas' | 'los' | 'dosis'>('mortalitas');

  // MORTALITAS STATE
  const [formDataMort, setFormDataMort] = useState({
    komor_sepsis: 0, urea_baseline: '', natrium_baseline: '',
    komp_eh: 0, inr_baseline: '', sgot_baseline: '', gfr: '', ctp_encoded: 1,
  });
  const [loadingMort, setLoadingMort] = useState(false);
  const [predictionMort, setPredictionMort] = useState<number | null>(null);
  const [showModalMort, setShowModalMort] = useState(false);
  const [savingMort, setSavingMort] = useState(false);

  const [autoGfrMort, setAutoGfrMort] = useState(false);
  const [gfrParamsMort, setGfrParamsMort] = useState({ scr: '', age: '', gender: 'L' });
  const kreatininOptions = Array.from({ length: 150 }, (_, i) => ((i + 1) / 10).toFixed(1));
  const usiaOptions = Array.from({ length: 83 }, (_, i) => i + 18);

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

  // LOS STATE
  const [formDataLos, setFormDataLos] = useState({
    komor_sepsis: 0, komp_eh: 0, ctp_encoded: 1,
    bilirubin_baseline: '', kreatinin_baseline: '', inr_baseline: '', 
    sgot_baseline: '', usia: '', gfr: '', jk: 'L'
  });
  const [loadingLos, setLoadingLos] = useState(false);
  const [predictionLos, setPredictionLos] = useState<number | null>(null);
  const [showModalLos, setShowModalLos] = useState(false);
  const [savingLos, setSavingLos] = useState(false);

  const [autoGfrLos, setAutoGfrLos] = useState(false);
  
  useEffect(() => {
    if (autoGfrLos && formDataLos.kreatinin_baseline && formDataLos.usia) {
      const scr = parseFloat(formDataLos.kreatinin_baseline);
      const age = parseFloat(formDataLos.usia);
      if (!isNaN(scr) && !isNaN(age) && scr > 0 && age > 0) {
        setFormDataLos(prev => ({ ...prev, gfr: hitungGfrCkdEpi(scr, age, formDataLos.jk as 'L'|'P') }));
      }
    }
  }, [autoGfrLos, formDataLos.kreatinin_baseline, formDataLos.usia, formDataLos.jk]);

  const [autoCtpLos, setAutoCtpLos] = useState(false);
  const [ctpParamsLos, setCtpParamsLos] = useState<CtpParams>({
    bilirubin: '', albumin: '', inr: '', ascites: '', encephalopathy: '',
  });
  const skorCtpLos = hitungSkorCtp(ctpParamsLos);

  useEffect(() => {
    if (autoCtpLos && skorCtpLos) {
      const ctpEncodedMap: Record<'A' | 'B' | 'C', number> = { A: 1, B: 2, C: 3 };
      const ctpEncodedBaru = ctpEncodedMap[skorCtpLos.kelas];
      const komplEhBaru = Number(ctpParamsLos.encephalopathy) >= 2 ? 1 : 0;
      setFormDataLos(prev => {
        if (prev.ctp_encoded === ctpEncodedBaru && prev.komp_eh === komplEhBaru) return prev;
        return { ...prev, ctp_encoded: ctpEncodedBaru, komp_eh: komplEhBaru };
      });
    }
  }, [autoCtpLos, skorCtpLos?.kelas, ctpParamsLos.encephalopathy]);

  // DOSIS STATE
  const [dosisData, setDosisData] = useState({
    gfr: '', ctp: 'A', map_value: '',
    ascites_refrakter: 0, hrs: 0, gagal_ginjal_akut: 0, sepsis_pneumonia: 0, ast_alt_tinggi: 0,
    obat_pilihan: {
      spiro_furo: false, spironolakton: false, furosemid: false,
      propranolol: false, carvedilol: false,
      ampisilin_sulbaktam: false, azitromisin: false, levofloxacin: false
    }
  });
  const [loadingDosis, setLoadingDosis] = useState(false);
  const [dosisResult, setDosisResult] = useState<any>(null);

  const [autoCtpDosis, setAutoCtpDosis] = useState(false);
  const [ctpParamsDosis, setCtpParamsDosis] = useState<CtpParams>({
    bilirubin: '', albumin: '', inr: '', ascites: '', encephalopathy: '',
  });
  const skorCtpDosis = hitungSkorCtp(ctpParamsDosis);

  useEffect(() => {
    if (autoCtpDosis && skorCtpDosis) {
      setDosisData(prev => (prev.ctp === skorCtpDosis.kelas ? prev : { ...prev, ctp: skorCtpDosis.kelas }));
    }
  }, [autoCtpDosis, skorCtpDosis?.kelas]);

  const handleObatToggle = (obat: string) => {
    setDosisData(prev => ({
      ...prev, obat_pilihan: { ...prev.obat_pilihan, [obat]: !(prev.obat_pilihan as any)[obat] }
    }));
  };

  const handleToggleAllObat = (checked: boolean) => {
    setDosisData(prev => ({
      ...prev,
      obat_pilihan: {
        spiro_furo: checked, spironolakton: checked, furosemid: checked,
        propranolol: checked, carvedilol: checked,
        ampisilin_sulbaktam: checked, azitromisin: checked, levofloxacin: checked
      }
    }));
  };

  // HANDLERS
  const handlePredictMortalitas = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMort(true);
    const payload = { ...formDataMort, 
      komor_sepsis: Number(formDataMort.komor_sepsis), urea_baseline: Number(formDataMort.urea_baseline),
      natrium_baseline: Number(formDataMort.natrium_baseline), komp_eh: Number(formDataMort.komp_eh),
      inr_baseline: Number(formDataMort.inr_baseline), sgot_baseline: Number(formDataMort.sgot_baseline),
      gfr: Number(formDataMort.gfr), ctp_encoded: Number(formDataMort.ctp_encoded),
    };

    try {
      const res = await fetch('/api/predict', { method: 'POST', body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.probability !== undefined) { setPredictionMort(data.probability); setShowModalMort(true); } 
      else { alert(data.error || 'Terjadi kesalahan internal.'); }
    } catch (error) { alert('Gagal menghubungi server AI.'); } 
    finally { setLoadingMort(false); }
  };

  const handlePredictLos = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingLos(true);
    const payload = { ...formDataLos, 
      komor_sepsis: Number(formDataLos.komor_sepsis), komp_eh: Number(formDataLos.komp_eh),
      bilirubin_baseline: Number(formDataLos.bilirubin_baseline), kreatinin_baseline: Number(formDataLos.kreatinin_baseline),
      inr_baseline: Number(formDataLos.inr_baseline), sgot_baseline: Number(formDataLos.sgot_baseline),
      usia: Number(formDataLos.usia), gfr: Number(formDataLos.gfr), ctp_encoded: Number(formDataLos.ctp_encoded),
    };

    try {
      const res = await fetch('/api/predict_los', { method: 'POST', body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.probability_los !== undefined) { setPredictionLos(data.probability_los); setShowModalLos(true); } 
      else { alert(data.error || 'Terjadi kesalahan internal.'); }
    } catch (error) { alert('Gagal menghubungi server AI.'); } 
    finally { setLoadingLos(false); }
  };

  const handlePredictDosis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingDosis(true);
    const selectedDrugsList = Object.entries(dosisData.obat_pilihan)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => key);

    try {
      const res = await fetch('/api/dosis', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dosisData, obat_pilihan: selectedDrugsList }),
      });
      const data = await res.json();
      if (res.ok) setDosisResult(data);
      else alert(data.error || 'Terjadi kesalahan sistem dosis.');
    } catch (error) { alert('Gagal menghubungi server rekomendasi.'); } 
    finally { setLoadingDosis(false); }
  };

  const handleSaveToDatabaseMort = async () => {
    setSavingMort(true);
    try {
      await fetch('/database/save', { method: 'POST', body: JSON.stringify({...formDataMort, probability: predictionMort}) });
      alert('Data Mortalitas berhasil disimpan ke Supabase!');
      setShowModalMort(false);
    } catch (error) { alert('Gagal menyimpan ke database.'); } 
    finally { setSavingMort(false); }
  };

  const handleSaveToDatabaseLos = async () => {
    setSavingLos(true);
    try {
      await fetch('/database/save', { method: 'POST', body: JSON.stringify({...formDataLos, probability_los: predictionLos}) });
      alert('Data LoS berhasil disimpan ke Supabase!');
      setShowModalLos(false);
    } catch (error) { alert('Gagal menyimpan ke database.'); } 
    finally { setSavingLos(false); }
  };

  return (
    <div className="py-8 px-4 flex flex-col items-center animate-fade-in">
      <div className="flex flex-col md:flex-row gap-2 mb-6 max-w-5xl w-full">
        <button onClick={() => setActiveTab('mortalitas')} className={`flex-1 py-4 text-center rounded-2xl md:rounded-b-none md:rounded-t-2xl font-bold transition-all ${activeTab === 'mortalitas' ? 'bg-red-900 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200 border-b-0'}`}>
          AI Prediksi Mortalitas
        </button>
        <button onClick={() => setActiveTab('los')} className={`flex-1 py-4 text-center rounded-2xl md:rounded-b-none md:rounded-t-2xl font-bold transition-all ${activeTab === 'los' ? 'bg-red-900 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200 border-b-0'}`}>
          AI Prediksi Lama Rawat
        </button>
        <button onClick={() => setActiveTab('dosis')} className={`flex-1 py-4 text-center rounded-2xl md:rounded-b-none md:rounded-t-2xl font-bold transition-all ${activeTab === 'dosis' ? 'bg-red-900 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200 border-b-0'}`}>
          Rekomendasi Dosis Klinis
        </button>
      </div>

      <div className="max-w-5xl w-full bg-white rounded-3xl md:rounded-t-none shadow-2xl overflow-hidden border border-gray-100">
        
        {/* =================================================================== */}
        {/* TAB 1: MORTALITAS */}
        {/* =================================================================== */}
        {activeTab === 'mortalitas' && (
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
                              value={formDataMort.ctp_encoded} 
                              disabled={autoCtpMort}
                              onChange={(e) => !autoCtpMort && setFormDataMort({...formDataMort, ctp_encoded: Number(e.target.value)})}
                            >
                              <option value={1}>Kelas A</option>
                              <option value={2}>Kelas B</option>
                              <option value={3}>Kelas C</option>
                            </select>
                        </div>
                    </CtpCalculator>
                  </div>
                  
                  {[ {id: 'urea_baseline', label: 'Urea Baseline (mg/dL)'}, {id: 'natrium_baseline', label: 'Natrium Baseline (mEq/L)'}, {id: 'inr_baseline', label: 'INR Baseline'}, {id: 'sgot_baseline', label: 'SGOT Baseline (U/L)'}].map((f) => (
                    <div key={f.id} className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">{f.label}</label>
                      <input type="number" step="any" required className="w-full bg-white border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800" value={(formDataMort as any)[f.id]} onChange={(e) => setFormDataMort({...formDataMort, [f.id]: e.target.value})} />
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
                          <select required={autoGfrMort} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-800 focus:border-red-800 bg-white" value={gfrParamsMort.scr} onChange={e => setGfrParamsMort({...gfrParamsMort, scr: e.target.value})}>
                            <option value="">-- Pilih --</option>
                            {kreatininOptions.map(val => (<option key={val} value={val}>{val}</option>))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1">Usia (Tahun)</label>
                          <select required={autoGfrMort} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-800 focus:border-red-800 bg-white" value={gfrParamsMort.age} onChange={e => setGfrParamsMort({...gfrParamsMort, age: e.target.value})}>
                            <option value="">-- Pilih --</option>
                            {usiaOptions.map(val => (<option key={val} value={val}>{val}</option>))}
                          </select>
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
                      placeholder={autoGfrMort ? "Otomatis terkalkulasi..." : "Masukkan nilai GFR manual"}
                      value={formDataMort.gfr} readOnly={autoGfrMort} onChange={(e) => !autoGfrMort && setFormDataMort({...formDataMort, gfr: e.target.value})} />
                  </div>
                </div>
                <button type="submit" disabled={loadingMort} className="w-full mt-10 bg-red-800 hover:bg-red-900 text-white font-bold py-4 rounded-xl shadow-lg transition-all">{loadingMort ? 'Mengkalkulasi...' : 'Analisis Probabilitas Mortalitas'}</button>
             </form>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: LAMA RAWAT (LoS) */}
        {/* =================================================================== */}
        {activeTab === 'los' && (
          <div className="animate-fade-in">
             <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-800 p-8 text-center shadow-inner">
                <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">Kalkulator Lama Rawat (LoS)</h1>
             </div>
             
             <form onSubmit={handlePredictLos} className="p-8 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2"><label className="block text-sm font-bold text-gray-700">Status Sepsis</label>
                    <select className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800" value={formDataLos.komor_sepsis} onChange={(e) => setFormDataLos({...formDataLos, komor_sepsis: Number(e.target.value)})}>
                      <option value={0}>Tidak Ada (0)</option><option value={1}>Ya, Sepsis (1)</option>
                    </select>
                  </div>
                  <div className="space-y-2"><label className="block text-sm font-bold text-gray-700">Ensefalopati Hepatikum</label>
                    <select className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800" value={formDataLos.komp_eh} onChange={(e) => setFormDataLos({...formDataLos, komp_eh: Number(e.target.value)})}>
                      <option value={0}>Tidak Ada (0)</option><option value={1}>Ya (1)</option>
                    </select>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <CtpCalculator active={autoCtpLos} onToggle={setAutoCtpLos} params={ctpParamsLos} onChangeParam={(key, value) => setCtpParamsLos(prev => ({ ...prev, [key]: value }))} hasil={skorCtpLos}>
                      <div className="space-y-2 mt-4 border-t border-gray-200 pt-4">
                          <label className="block text-sm font-bold text-gray-700">Skor CTP (Input Manual)</label>
                          <select 
                            className={`w-full border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800 transition-all ${autoCtpLos ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-inner' : 'bg-white text-gray-900'}`} 
                            value={formDataLos.ctp_encoded} 
                            disabled={autoCtpLos}
                            onChange={(e) => !autoCtpLos && setFormDataLos({...formDataLos, ctp_encoded: Number(e.target.value)})}
                          >
                            <option value={1}>Kelas A</option>
                            <option value={2}>Kelas B</option>
                            <option value={3}>Kelas C</option>
                          </select>
                      </div>
                    </CtpCalculator>
                  </div>
                  
                  {[ 
                    {id: 'usia', label: 'Usia (Tahun)'},
                    {id: 'kreatinin_baseline', label: 'Kreatinin Baseline (mg/dL)'},
                    {id: 'bilirubin_baseline', label: 'Bilirubin Baseline (mg/dL)'},
                    {id: 'inr_baseline', label: 'INR Baseline'}, 
                    {id: 'sgot_baseline', label: 'SGOT Baseline (U/L)'}
                  ].map((f) => (
                    <div key={f.id} className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">{f.label}</label>
                      <input type="number" step="any" required className="w-full bg-white border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800" value={(formDataLos as any)[f.id]} onChange={(e) => setFormDataLos({...formDataLos, [f.id]: e.target.value})} />
                    </div>
                  ))}

                  <div className="col-span-1 md:col-span-2 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm mt-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                      <label className="text-sm font-bold text-gray-700">Nilai GFR / CKD-EPI (mL/min)</label>
                      <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                        <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800"
                          checked={autoGfrLos} onChange={(e) => setAutoGfrLos(e.target.checked)} />
                        <span className="text-xs font-bold text-red-900">Hitung Otomatis dari Kreatinin & Usia</span>
                      </label>
                    </div>

                    {autoGfrLos && (
                      <div className="mb-4 p-4 bg-white rounded-xl border border-red-100 shadow-inner">
                        <label className="block text-xs font-bold text-gray-600 mb-1">Jenis Kelamin (untuk Formula CKD-EPI)</label>
                        <select className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-800 bg-white"
                          value={formDataLos.jk} onChange={e => setFormDataLos({...formDataLos, jk: e.target.value})}>
                          <option value="L">Laki-laki</option>
                          <option value="P">Perempuan</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-2 italic">*Nilai Kreatinin dan Usia akan ditarik secara otomatis dari input form di atas.</p>
                      </div>
                    )}

                    <input type="number" step="any" required 
                      className={`w-full border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800 transition-all ${autoGfrLos ? 'bg-gray-100 text-red-900 font-bold cursor-not-allowed shadow-inner' : 'bg-white text-gray-900'}`}
                      placeholder={autoGfrLos ? "Otomatis terkalkulasi..." : "Masukkan nilai GFR manual"}
                      value={formDataLos.gfr} 
                      readOnly={autoGfrLos}
                      onChange={(e) => !autoGfrLos && setFormDataLos({...formDataLos, gfr: e.target.value})} />
                  </div>
                </div>
                <button type="submit" disabled={loadingLos} className="w-full mt-10 bg-red-800 hover:bg-red-900 text-white font-bold py-4 rounded-xl shadow-lg transition-all">{loadingLos ? 'Mengkalkulasi...' : 'Analisis Prediksi Lama Rawat'}</button>
             </form>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: DOSIS OBAT */}
        {/* =================================================================== */}
        {activeTab === 'dosis' && (
          <div className="animate-fade-in flex flex-col md:flex-row">
            <div className={`p-8 md:p-10 ${dosisResult ? 'md:w-1/2 border-r border-gray-100' : 'w-full'}`}>
              <div className="mb-6"><h2 className="text-2xl font-extrabold text-red-900">Evaluasi Dosis & Terapi</h2></div>
              <form onSubmit={handlePredictDosis} className="space-y-5">
                
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-800"></div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                    <p className="text-sm font-bold text-gray-800">Pilih Obat untuk Dievaluasi</p>
                    <button type="button" onClick={() => handleToggleAllObat(true)} className="text-xs font-bold text-red-800 hover:text-red-900 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-colors">Pilih Semua</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 space-y-2">
                        <p className="text-xs font-bold text-blue-900 mb-2 border-b border-blue-200 pb-1">Diuretik</p>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800" checked={dosisData.obat_pilihan.spiro_furo} onChange={() => handleObatToggle('spiro_furo')} />
                          <span className="text-sm font-semibold text-gray-700">Kombinasi (Spiro+Furo)</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800" checked={dosisData.obat_pilihan.spironolakton} onChange={() => handleObatToggle('spironolakton')} />
                          <span className="text-sm font-semibold text-gray-700">Spironolakton Tunggal</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800" checked={dosisData.obat_pilihan.furosemid} onChange={() => handleObatToggle('furosemid')} />
                          <span className="text-sm font-semibold text-gray-700">Furosemid Tunggal</span>
                        </label>
                    </div>

                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 space-y-2">
                        <p className="text-xs font-bold text-emerald-900 mb-2 border-b border-emerald-200 pb-1">Beta-Bloker</p>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800" checked={dosisData.obat_pilihan.propranolol} onChange={() => handleObatToggle('propranolol')} />
                          <span className="text-sm font-semibold text-gray-700">Propranolol</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800" checked={dosisData.obat_pilihan.carvedilol} onChange={() => handleObatToggle('carvedilol')} />
                          <span className="text-sm font-semibold text-gray-700">Carvedilol</span>
                        </label>
                    </div>

                    <div className="bg-rose-50 p-3 rounded-lg border border-rose-100 space-y-2 col-span-1 md:col-span-2">
                        <p className="text-xs font-bold text-rose-900 mb-2 border-b border-rose-200 pb-1">Antibiotik (Bila Terdapat Indikasi Infeksi)</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800" checked={dosisData.obat_pilihan.ampisilin_sulbaktam} onChange={() => handleObatToggle('ampisilin_sulbaktam')} />
                              <span className="text-sm font-semibold text-gray-700">Ampisilin-Sulbaktam</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800" checked={dosisData.obat_pilihan.levofloxacin} onChange={() => handleObatToggle('levofloxacin')} />
                              <span className="text-sm font-semibold text-gray-700">Levofloxacin</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800" checked={dosisData.obat_pilihan.azitromisin} onChange={() => handleObatToggle('azitromisin')} />
                              <span className="text-sm font-semibold text-gray-700">Azitromisin</span>
                            </label>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Nilai GFR / CrCl (mL/min)</label>
                    <input type="number" step="any" required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" value={dosisData.gfr} onChange={(e) => setDosisData({...dosisData, gfr: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">MAP (mmHg) - Opsional</label>
                    <input type="number" step="any" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" value={dosisData.map_value} onChange={(e) => setDosisData({...dosisData, map_value: e.target.value})} />
                  </div>
                </div>

                <CtpCalculator active={autoCtpDosis} onToggle={setAutoCtpDosis} params={ctpParamsDosis} onChangeParam={(key, value) => setCtpParamsDosis(prev => ({ ...prev, [key]: value }))} hasil={skorCtpDosis}>
                    <div className="space-y-2 mt-4 border-t border-gray-200 pt-4">
                        <label className="block text-sm font-bold text-gray-700">Kelas CTP (Input Manual)</label>
                        <select 
                          className={`w-full border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800 transition-all ${autoCtpDosis ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-inner' : 'bg-white text-gray-900'}`} 
                          value={dosisData.ctp} 
                          disabled={autoCtpDosis}
                          onChange={(e) => !autoCtpDosis && setDosisData({...dosisData, ctp: e.target.value})}
                        >
                          <option value="A">Kelas A</option>
                          <option value="B">Kelas B</option>
                          <option value="C">Kelas C</option>
                        </select>
                    </div>
                </CtpCalculator>

                <div className="space-y-3 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3 uppercase tracking-wider">Komplikasi & Kondisi Akut</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[ 
                      {id: 'ascites_refrakter', label: 'Ascites Refrakter'}, 
                      {id: 'hrs', label: 'Hepatorenal Syndrome (HRS)'}, 
                      {id: 'gagal_ginjal_akut', label: 'Gagal Ginjal Akut (AKI/CKD)'}, 
                      {id: 'sepsis_pneumonia', label: 'Sepsis atau Pneumonia'},
                      {id: 'ast_alt_tinggi', label: 'AST/ALT > 2x Normal'}
                    ].map((tg) => (
                      <label key={tg.id} className="flex items-center space-x-3 cursor-pointer bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm hover:bg-red-50 transition-colors">
                        <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800" checked={(dosisData as any)[tg.id] === 1} onChange={(e) => setDosisData({...dosisData, [tg.id]: e.target.checked ? 1 : 0})} />
                        <span className="text-sm font-medium text-gray-700">{tg.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loadingDosis} className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-4 rounded-xl shadow-lg transition-all">{loadingDosis ? 'Memproses Rule Engine...' : 'Cek Rekomendasi Dosis'}</button>
              </form>
            </div>

            {dosisResult && (
              <div className="md:w-1/2 p-8 md:p-10 bg-gray-50 flex flex-col h-full border-t md:border-t-0 border-gray-200">
                <div className="mb-6">
                  <h2 className="text-xl font-extrabold text-red-900 mb-1">Hasil Rekomendasi</h2>
                  <p className="text-xs text-red-600 bg-red-100 inline-block px-2 py-1 rounded font-bold">⚠️ PROTOTIPE - Wajib Review Klinis</p>
                </div>
                
                <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {dosisResult.info ? (
                    <div className="p-5 rounded-xl bg-gray-100 border border-gray-300 text-center">
                      <p className="text-gray-600 font-bold">{dosisResult.info.alasan}</p>
                    </div>
                  ) : (
                    Object.entries(dosisResult).map(([key, data]: [string, any]) => (
                      <div key={key} className={`p-5 rounded-xl border ${data.status.includes('Avoid') || data.status.includes('Hindari') ? 'bg-red-50 border-red-200' : data.status.includes('Reduce') || data.status.includes('Kurangi') || data.status.includes('Monitor') ? 'bg-amber-50 border-amber-200' : data.status === 'N/A' || data.status === 'Belum Tersedia' ? 'bg-gray-100 border-gray-300' : 'bg-white border-emerald-200 shadow-sm'}`}>
                        <h3 className="font-extrabold text-gray-900 text-lg">{data.obat}</h3>
                        <div className="mt-3 flex items-center mb-4">
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${data.status.includes('Avoid') || data.status.includes('Hindari') ? 'bg-red-200 text-red-900' : data.status.includes('Reduce') || data.status.includes('Kurangi') || data.status.includes('Monitor') ? 'bg-amber-200 text-amber-900' : data.status === 'N/A' || data.status === 'Belum Tersedia' ? 'bg-gray-200 text-gray-600' : 'bg-emerald-100 text-emerald-800'}`}>
                            {data.status}
                          </span>
                        </div>
                        <p className="text-xl font-black text-gray-800 leading-tight">{data.rentang_dosis}</p>
                        
                        <div className="mt-4 border-t border-gray-200 pt-3">
                          <p className="text-sm text-gray-700 leading-relaxed"><b className="text-gray-900">Alasan:</b> {data.alasan}</p>
                        </div>
                        
                        {data.peringatan && data.peringatan.length > 0 && (
                          <div className="mt-4 bg-red-100 p-3.5 rounded-lg border border-red-200 text-xs text-red-900 shadow-inner">
                            <b className="uppercase tracking-wider">Perhatian Khusus:</b>
                            <ul className="list-disc pl-5 mt-1.5 space-y-1">
                              {data.peringatan.map((w: string, i: number) => <li key={i} className="leading-relaxed">{w}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showModalMort && predictionMort !== null && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
              <div className="bg-red-900 p-5 text-center"><h2 className="text-xl font-bold text-white">Laporan Hasil AI</h2></div>
              <div className="p-8">
                <div className={`text-center py-8 rounded-2xl mb-6 border ${predictionMort >= 0.4 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <p className="text-gray-600 font-semibold mb-2">Probabilitas Kematian</p>
                  <p className={`text-6xl font-black tracking-tight ${predictionMort >= 0.4 ? 'text-red-700' : 'text-emerald-600'}`}>{(predictionMort * 100).toFixed(1)}<span className="text-4xl">%</span></p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowModalMort(false)} className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 py-3 rounded-xl font-bold">Tutup</button>
                  <button onClick={handleSaveToDatabaseMort} disabled={savingMort} className="flex-1 bg-red-800 hover:bg-red-900 text-white py-3 rounded-xl font-bold">{savingMort ? 'Menyimpan...' : 'Simpan ke Database'}</button>
                </div>
              </div>
            </div>
          </div>
      )}

      {showModalLos && predictionLos !== null && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
              <div className="bg-red-900 p-5 text-center"><h2 className="text-xl font-bold text-white">Laporan Prediksi Lama Rawat</h2></div>
              <div className="p-8">
                <div className={`text-center py-8 rounded-2xl mb-6 border ${predictionLos >= 0.5 ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
                  <p className="text-gray-600 font-semibold mb-2">Risiko Rawat Inap &gt; 7 Hari</p>
                  <p className={`text-6xl font-black tracking-tight ${predictionLos >= 0.5 ? 'text-amber-700' : 'text-blue-600'}`}>{(predictionLos * 100).toFixed(1)}<span className="text-4xl">%</span></p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowModalLos(false)} className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 py-3 rounded-xl font-bold">Tutup</button>
                  <button onClick={handleSaveToDatabaseLos} disabled={savingLos} className="flex-1 bg-red-800 hover:bg-red-900 text-white py-3 rounded-xl font-bold">{savingLos ? 'Menyimpan...' : 'Simpan ke Database'}</button>
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}