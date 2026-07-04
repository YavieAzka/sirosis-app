'use client';

import { useState, useEffect } from 'react';

type CtpParamKey = 'bilirubin' | 'albumin' | 'inr' | 'ascites' | 'encephalopathy';
type CtpParams = Record<CtpParamKey, string>;

const CTP_OPTIONS: Record<CtpParamKey, { value: string; label: string }[]> = {
  bilirubin: [
    { value: '1', label: '<2 mg/dL (<34.2 µmol/L)' },
    { value: '2', label: '2-3 mg/dL (34.2-51.3 µmol/L)' },
    { value: '3', label: '>3 mg/dL (>51.3 µmol/L)' },
  ],
  albumin: [
    { value: '1', label: '>3.5 g/dL (>35 g/L)' },
    { value: '2', label: '2.8-3.5 g/dL (28-35 g/L)' },
    { value: '3', label: '<2.8 g/dL (<28 g/L)' },
  ],
  inr: [
    { value: '1', label: '<1.7' },
    { value: '2', label: '1.7-2.3' },
    { value: '3', label: '>2.3' },
  ],
  ascites: [
    { value: '1', label: 'Absent (Tidak Ada)' },
    { value: '2', label: 'Slight (Ringan)' },
    { value: '3', label: 'Moderate (Sedang-Berat)' },
  ],
  encephalopathy: [
    { value: '1', label: 'No Encephalopathy' },
    { value: '2', label: 'Grade 1-2' },
    { value: '3', label: 'Grade 3-4' },
  ],
};

const CTP_PARAM_LABELS: Record<CtpParamKey, string> = {
  bilirubin: 'Bilirubin (Total)',
  albumin: 'Albumin',
  inr: 'INR',
  ascites: 'Ascites',
  encephalopathy: 'Encephalopathy',
};

function hitungSkorCtp(params: CtpParams): { total: number; kelas: 'A' | 'B' | 'C' } | null {
  const { bilirubin, albumin, inr, ascites, encephalopathy } = params;
  if (!bilirubin || !albumin || !inr || !ascites || !encephalopathy) return null;
  const total = Number(bilirubin) + Number(albumin) + Number(inr) + Number(ascites) + Number(encephalopathy);
  let kelas: 'A' | 'B' | 'C';
  if (total <= 6) kelas = 'A';
  else if (total <= 9) kelas = 'B';
  else kelas = 'C';
  return { total, kelas };
}

// Helper untuk formula CKD-EPI 2021
function hitungGfrCkdEpi(scr: number, age: number, gender: 'L' | 'P'): string {
  const k = gender === 'P' ? 0.7 : 0.9;
  const alpha = gender === 'P' ? -0.241 : -0.302;
  const minVal = Math.min(scr / k, 1);
  const maxVal = Math.max(scr / k, 1);
  const genderMultiplier = gender === 'P' ? 1.012 : 1;
  const egfr = 142 * Math.pow(minVal, alpha) * Math.pow(maxVal, -1.200) * Math.pow(0.9938, age) * genderMultiplier;
  return egfr.toFixed(2);
}

function CtpCalculator({
  active, onToggle, params, onChangeParam, hasil,
}: {
  active: boolean;
  onToggle: (val: boolean) => void;
  params: CtpParams;
  onChangeParam: (key: CtpParamKey, value: string) => void;
  hasil: { total: number; kelas: 'A' | 'B' | 'C' } | null;
}) {
  return (
    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        <label className="text-sm font-bold text-gray-700">Skor CTP (Child-Turcotte-Pugh)</label>
        <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
          <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800"
            checked={active} onChange={(e) => onToggle(e.target.checked)} />
          <span className="text-xs font-bold text-red-900">Hitung Otomatis dari Parameter Klinis</span>
        </label>
      </div>

      {active && (
        <div className="space-y-3 mb-4 p-4 bg-white rounded-xl border border-red-100 shadow-inner">
          {(Object.keys(CTP_OPTIONS) as CtpParamKey[]).map((key) => (
            <div key={key}>
              <label className="block text-xs font-bold text-gray-600 mb-1">{CTP_PARAM_LABELS[key]}</label>
              <select required={active} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-800 focus:border-red-800 bg-white"
                value={params[key]} onChange={(e) => onChangeParam(key, e.target.value)}>
                <option value="">-- Pilih --</option>
                {CTP_OPTIONS[key].map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          ))}

          {hasil && (
            <div className="mt-2 p-3 rounded-lg bg-red-50 border border-red-200 text-center">
              <p className="text-xs font-semibold text-gray-600">Total Skor: <span className="font-black text-red-900">{hasil.total}</span> &nbsp;→&nbsp; Kelas CTP: <span className="font-black text-red-900">{hasil.kelas}</span></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'mortalitas' | 'los' | 'dosis'>('mortalitas');

  // ==========================================
  // 1. STATE: MORTALITAS (Dikembalikan seperti semula)
  // ==========================================
  const [formDataMort, setFormDataMort] = useState({
    komor_sepsis: 0, urea_baseline: '', natrium_baseline: '',
    komp_eh: 0, inr_baseline: '', sgot_baseline: '', gfr: '', ctp_encoded: 1,
  });
  const [loadingMort, setLoadingMort] = useState(false);
  const [predictionMort, setPredictionMort] = useState<number | null>(null);
  const [showModalMort, setShowModalMort] = useState(false);
  const [savingMort, setSavingMort] = useState(false);

  // GFR Otomatis Mortalitas (Versi Dropdown Asli)
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

  // CTP Mortalitas
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

  // ==========================================
  // 2. STATE: LAMA RAWAT (LoS) - Form Baru
  // ==========================================
  const [formDataLos, setFormDataLos] = useState({
    komor_sepsis: 0, komp_eh: 0, ctp_encoded: 1,
    bilirubin_baseline: '', kreatinin_baseline: '', inr_baseline: '', 
    sgot_baseline: '', usia: '', gfr: '', jk: 'L'
  });
  const [loadingLos, setLoadingLos] = useState(false);
  const [predictionLos, setPredictionLos] = useState<number | null>(null);
  const [showModalLos, setShowModalLos] = useState(false);
  const [savingLos, setSavingLos] = useState(false);

  // GFR Otomatis LoS (Menarik data dari input form langsung)
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

  // CTP LoS
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

  // ==========================================
  // 3. STATE: DOSIS
  // ==========================================
  const [dosisData, setDosisData] = useState({
    gfr: '', ctp: 'A', map_value: '', berat_badan: '',
    ascites_refrakter: 0, hrs: 0, gagal_ginjal_akut: 0, hiperkalemia_berat: 0,
    jenis_antibiotik: 'ampisilin_sulbaktam', jenis_betabloker: 'propranolol',
    obat_pilihan: { diuretik: true, betabloker: true, analgetik: true, antibiotik: false }
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

  // ==========================================
  // HANDLERS
  // ==========================================
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
    <main className="min-h-screen bg-gray-50 text-gray-800 font-sans py-12 px-4 flex flex-col items-center">
      
      {/* TABS NAVIGATION */}
      <div className="flex flex-col md:flex-row gap-2 mb-6 max-w-5xl w-full">
        <button onClick={() => setActiveTab('mortalitas')} className={`flex-1 py-4 text-center rounded-2xl md:rounded-b-none md:rounded-t-2xl font-bold transition-all ${activeTab === 'mortalitas' ? 'bg-red-900 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200 border-b-0'}`}>
          📈 AI Prediksi Mortalitas
        </button>
        <button onClick={() => setActiveTab('los')} className={`flex-1 py-4 text-center rounded-2xl md:rounded-b-none md:rounded-t-2xl font-bold transition-all ${activeTab === 'los' ? 'bg-red-900 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200 border-b-0'}`}>
          🏥 AI Prediksi Lama Rawat
        </button>
        <button onClick={() => setActiveTab('dosis')} className={`flex-1 py-4 text-center rounded-2xl md:rounded-b-none md:rounded-t-2xl font-bold transition-all ${activeTab === 'dosis' ? 'bg-red-900 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200 border-b-0'}`}>
          💊 Rekomendasi Dosis Klinis
        </button>
      </div>

      <div className="max-w-5xl w-full bg-white rounded-3xl md:rounded-t-none shadow-2xl overflow-hidden border border-gray-100">
        
        {/* =================================================================== */}
        {/* TAB 1: MORTALITAS (Versi Asli) */}
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
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <CtpCalculator active={autoCtpMort} onToggle={setAutoCtpMort} params={ctpParamsMort} onChangeParam={(key, value) => setCtpParamsMort(prev => ({ ...prev, [key]: value }))} hasil={skorCtpMort} />
                    {!autoCtpMort && (
                      <div className="space-y-2 mt-4">
                        <label className="block text-sm font-bold text-gray-700">Skor CTP (Input Manual)</label>
                        <select className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800" value={formDataMort.ctp_encoded} onChange={(e) => setFormDataMort({...formDataMort, ctp_encoded: Number(e.target.value)})}>
                          <option value={1}>Kelas A</option><option value={2}>Kelas B</option><option value={3}>Kelas C</option>
                        </select>
                      </div>
                    )}
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
                  
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <CtpCalculator active={autoCtpLos} onToggle={setAutoCtpLos} params={ctpParamsLos} onChangeParam={(key, value) => setCtpParamsLos(prev => ({ ...prev, [key]: value }))} hasil={skorCtpLos} />
                    {!autoCtpLos && (
                      <div className="space-y-2 mt-4">
                        <label className="block text-sm font-bold text-gray-700">Skor CTP (Input Manual)</label>
                        <select className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800" value={formDataLos.ctp_encoded} onChange={(e) => setFormDataLos({...formDataLos, ctp_encoded: Number(e.target.value)})}>
                          <option value={1}>Kelas A</option><option value={2}>Kelas B</option><option value={3}>Kelas C</option>
                        </select>
                      </div>
                    )}
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

                  {/* Kalkulator GFR Khusus untuk LoS (Terkoneksi langsung ke form utama) */}
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
              <div className="mb-6"><h2 className="text-2xl font-extrabold text-red-900">Kondisi Klinis Pasien</h2></div>
              <form onSubmit={handlePredictDosis} className="space-y-5">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-800"></div>
                  <p className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Pilih Rencana Terapi Obat</p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800" checked={dosisData.obat_pilihan.diuretik} onChange={() => setDosisData(prev => ({...prev, obat_pilihan: {...prev.obat_pilihan, diuretik: !prev.obat_pilihan.diuretik}}))} />
                        <span className="text-sm font-semibold text-gray-700">Diuretik</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800" checked={dosisData.obat_pilihan.analgetik} onChange={() => setDosisData(prev => ({...prev, obat_pilihan: {...prev.obat_pilihan, analgetik: !prev.obat_pilihan.analgetik}}))} />
                        <span className="text-sm font-semibold text-gray-700">Analgetik (Parasetamol)</span>
                      </label>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800" checked={dosisData.obat_pilihan.betabloker} onChange={() => setDosisData(prev => ({...prev, obat_pilihan: {...prev.obat_pilihan, betabloker: !prev.obat_pilihan.betabloker}}))} />
                        <span className="text-sm font-semibold text-gray-700">Beta-bloker</span>
                      </label>
                      {dosisData.obat_pilihan.betabloker && (
                        <div className="mt-3 ml-7">
                          <select className="w-full border-gray-300 rounded-md p-2 text-sm bg-white shadow-sm focus:border-red-800 focus:ring-red-800" value={dosisData.jenis_betabloker} onChange={(e) => setDosisData({...dosisData, jenis_betabloker: e.target.value})}>
                            <option value="propranolol">Propranolol</option>
                            <option value="carvedilol">Carvedilol</option>
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800" checked={dosisData.obat_pilihan.antibiotik} onChange={() => setDosisData(prev => ({...prev, obat_pilihan: {...prev.obat_pilihan, antibiotik: !prev.obat_pilihan.antibiotik}}))} />
                        <span className="text-sm font-bold text-red-900">Antibiotik (Terdapat Indikasi Infeksi)</span>
                      </label>
                      {dosisData.obat_pilihan.antibiotik && (
                        <div className="mt-3 ml-7">
                          <select className="w-full border-gray-300 rounded-md p-2 text-sm bg-white shadow-sm focus:border-red-800 focus:ring-red-800" value={dosisData.jenis_antibiotik} onChange={(e) => setDosisData({...dosisData, jenis_antibiotik: e.target.value})}>
                            <option value="ampisilin_sulbaktam">Ampisilin-Sulbaktam</option>
                            <option value="levofloxacin">Levofloxacin</option>
                            <option value="azitromisin">Azitromisin</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">GFR (mL/min)</label>
                    <input type="number" step="any" required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" value={dosisData.gfr} onChange={(e) => setDosisData({...dosisData, gfr: e.target.value})} /></div>
                  {!autoCtpDosis && (
                    <div><label className="block text-xs font-bold text-gray-700 mb-1">Kelas CTP (Manual)</label>
                      <select className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white" value={dosisData.ctp} onChange={(e) => setDosisData({...dosisData, ctp: e.target.value})}>
                        <option value="A">A</option><option value="B">B</option><option value="C">C</option>
                      </select></div>
                  )}
                </div>

                <CtpCalculator active={autoCtpDosis} onToggle={setAutoCtpDosis} params={ctpParamsDosis} onChangeParam={(key, value) => setCtpParamsDosis(prev => ({ ...prev, [key]: value }))} hasil={skorCtpDosis} />

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">MAP (mmHg) - Opsional</label>
                    <input type="number" step="any" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" value={dosisData.map_value} onChange={(e) => setDosisData({...dosisData, map_value: e.target.value})} /></div>
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">Berat Badan (kg) - Opsional</label>
                    <input type="number" step="any" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" value={dosisData.berat_badan} onChange={(e) => setDosisData({...dosisData, berat_badan: e.target.value})} /></div>
                </div>

                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Komplikasi & Kondisi Akut</p>
                  {[ {id: 'ascites_refrakter', label: 'Ascites Refrakter'}, {id: 'hrs', label: 'Hepatorenal Syndrome (HRS)'}, {id: 'gagal_ginjal_akut', label: 'Gagal Ginjal Akut (AKI)'}, {id: 'hiperkalemia_berat', label: 'Hiperkalemia Berat'} ].map((tg) => (
                    <label key={tg.id} className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800" checked={(dosisData as any)[tg.id] === 1} onChange={(e) => setDosisData({...dosisData, [tg.id]: e.target.checked ? 1 : 0})} />
                      <span className="text-sm font-medium text-gray-700">{tg.label}</span>
                    </label>
                  ))}
                </div>

                <button type="submit" disabled={loadingDosis} className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-3.5 rounded-xl shadow-md transition-all">{loadingDosis ? 'Memproses Rule Engine...' : 'Cek Rekomendasi Dosis'}</button>
              </form>
            </div>

            {dosisResult && (
              <div className="md:w-1/2 p-8 md:p-10 bg-gray-50 flex flex-col h-full border-t md:border-t-0 border-gray-200">
                <div className="mb-6">
                  <h2 className="text-xl font-extrabold text-red-900 mb-1">Hasil Rekomendasi</h2>
                  <p className="text-xs text-red-600 bg-red-100 inline-block px-2 py-1 rounded font-bold">⚠️ PROTOTIPE - Wajib Review Klinis</p>
                </div>
                
                <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(dosisResult).map(([key, data]: [string, any]) => (
                    <div key={key} className={`p-4 rounded-xl border ${data.status.includes('Hindari') ? 'bg-red-50 border-red-200' : data.status.includes('Kurangi') || data.status.includes('Reduce') || data.status.includes('Monitor') ? 'bg-amber-50 border-amber-200' : data.status === 'N/A' ? 'bg-gray-100 border-gray-300' : 'bg-white border-emerald-200 shadow-sm'}`}>
                      <h3 className="font-bold text-gray-900">{data.obat}</h3>
                      <div className="mt-2 flex items-center">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${data.status.includes('Hindari') ? 'bg-red-200 text-red-900' : data.status.includes('Kurangi') || data.status.includes('Reduce') || data.status.includes('Monitor') ? 'bg-amber-200 text-amber-900' : data.status === 'N/A' ? 'bg-gray-200 text-gray-600' : 'bg-emerald-100 text-emerald-800'}`}>{data.status}</span>
                      </div>
                      <p className="mt-3 text-lg font-black text-gray-800">{data.rentang_dosis}</p>
                      {data.frekuensi && <p className="text-sm font-medium text-gray-600 mt-1">Frekuensi: {data.frekuensi}</p>}
                      <p className="text-xs text-gray-500 mt-3 border-t border-gray-200 pt-2"><b>Alasan:</b> {data.alasan}</p>
                      
                      {data.peringatan && data.peringatan.length > 0 && (
                        <div className="mt-3 bg-red-100 p-2.5 rounded text-xs text-red-800">
                          <b>Peringatan:</b>
                          <ul className="list-disc pl-4 mt-1 space-y-0.5">{data.peringatan.map((w: string, i: number) => <li key={i}>{w}</li>)}</ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Result Mortalitas */}
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

      {/* Modal Result LoS */}
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
    </main>
  );
}