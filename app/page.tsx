'use client';

import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'mortalitas' | 'dosis'>('mortalitas');

  // ==========================================
  // STATE: MORTALITAS
  // ==========================================
  const [formData, setFormData] = useState({
    komor_sepsis: 0, urea_baseline: '', natrium_baseline: '',
    komp_eh: 0, inr_baseline: '', sgot_baseline: '', gfr: '', ctp_encoded: 1,
  });
  const [loadingMort, setLoadingMort] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // STATE: DOSIS
  // ==========================================
  const [dosisData, setDosisData] = useState({
    gfr: '', ctp: 'A', map_value: '', berat_badan: '',
    ascites_refrakter: 0, hrs: 0, gagal_ginjal_akut: 0, hiperkalemia_berat: 0,
    ada_infeksi: 0, butuh_antibiotik: 0, jenis_antibiotik: 'ampisilin_sulbaktam', 
    jenis_betabloker: 'propranolol' // <--- TAMBAHAN BARU
  });
  const [loadingDosis, setLoadingDosis] = useState(false);
  const [dosisResult, setDosisResult] = useState<any>(null);

  // ==========================================
  // HANDLERS
  // ==========================================
  const handlePredictMortalitas = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMort(true);
    const payload = { ...formData, 
      komor_sepsis: Number(formData.komor_sepsis), urea_baseline: Number(formData.urea_baseline),
      natrium_baseline: Number(formData.natrium_baseline), komp_eh: Number(formData.komp_eh),
      inr_baseline: Number(formData.inr_baseline), sgot_baseline: Number(formData.sgot_baseline),
      gfr: Number(formData.gfr), ctp_encoded: Number(formData.ctp_encoded),
    };

    try {
      const res = await fetch('/api/predict', {
        method: 'POST', body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.probability !== undefined) { setPrediction(data.probability); setShowModal(true); } 
      else { alert(data.error || 'Terjadi kesalahan internal.'); }
    } catch (error) { alert('Gagal menghubungi server AI.'); } 
    finally { setLoadingMort(false); }
  };

  const handleSaveToDatabase = async () => {
    setSaving(true);
    try {
      await fetch('/database/save', { method: 'POST', body: JSON.stringify({...formData, probability: prediction}) });
      alert('Data berhasil disimpan ke Supabase!');
      setShowModal(false);
    } catch (error) { alert('Gagal menyimpan ke database.'); } 
    finally { setSaving(false); }
  };

  const handlePredictDosis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingDosis(true);
    try {
      const res = await fetch('/api/dosis', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, // <-- Tambahkan baris ini
        body: JSON.stringify(dosisData),
      });
      const data = await res.json();
      if (res.ok) setDosisResult(data);
      else alert(data.error || 'Terjadi kesalahan sistem dosis.');
    } catch (error) { 
      alert('Gagal menghubungi server rekomendasi.'); 
    } 
    finally { setLoadingDosis(false); }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 font-sans py-12 px-4 flex flex-col items-center">
      
      {/* TABS NAVIGATION */}
      <div className="flex space-x-2 mb-6 max-w-4xl w-full">
        <button onClick={() => setActiveTab('mortalitas')} className={`flex-1 py-4 text-center rounded-t-2xl font-bold transition-all ${activeTab === 'mortalitas' ? 'bg-red-900 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>
          📈 AI Prediksi Mortalitas
        </button>
        <button onClick={() => setActiveTab('dosis')} className={`flex-1 py-4 text-center rounded-t-2xl font-bold transition-all ${activeTab === 'dosis' ? 'bg-red-900 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>
          💊 Rekomendasi Dosis Klinis
        </button>
      </div>

      <div className="max-w-4xl w-full bg-white rounded-b-3xl rounded-t-none md:rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
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
                    <select className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800" value={formData.komor_sepsis} onChange={(e) => setFormData({...formData, komor_sepsis: Number(e.target.value)})}>
                      <option value={0}>Tidak Ada (0)</option><option value={1}>Ya, Sepsis (1)</option>
                    </select>
                  </div>
                  <div className="space-y-2"><label className="block text-sm font-bold text-gray-700">Ensefalopati Hepatikum</label>
                    <select className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800" value={formData.komp_eh} onChange={(e) => setFormData({...formData, komp_eh: Number(e.target.value)})}>
                      <option value={0}>Tidak Ada (0)</option><option value={1}>Ya (1)</option>
                    </select>
                  </div>
                  <div className="space-y-2"><label className="block text-sm font-bold text-gray-700">Skor CTP</label>
                    <select className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800" value={formData.ctp_encoded} onChange={(e) => setFormData({...formData, ctp_encoded: Number(e.target.value)})}>
                      <option value={1}>Kelas A</option><option value={2}>Kelas B</option><option value={3}>Kelas C</option>
                    </select>
                  </div>
                  {/* NUMERIK */}
                  {[ {id: 'urea_baseline', label: 'Urea Baseline (mg/dL)'}, {id: 'natrium_baseline', label: 'Natrium Baseline (mEq/L)'}, {id: 'inr_baseline', label: 'INR Baseline'}, {id: 'sgot_baseline', label: 'SGOT Baseline (U/L)'}, {id: 'gfr', label: 'GFR / CKD-EPI (mL/min)'}].map((f) => (
                    <div key={f.id} className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">{f.label}</label>
                      <input type="number" step="any" required className="w-full bg-white border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800" value={(formData as any)[f.id]} onChange={(e) => setFormData({...formData, [f.id]: e.target.value})} />
                    </div>
                  ))}
                </div>
                <button type="submit" disabled={loadingMort} className="w-full mt-10 bg-red-800 hover:bg-red-900 text-white font-bold py-4 rounded-xl shadow-lg transition-all">{loadingMort ? 'Mengkalkulasi...' : 'Analisis Probabilitas Mortalitas'}</button>
             </form>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: DOSIS OBAT */}
        {/* =================================================================== */}
        {activeTab === 'dosis' && (
          <div className="animate-fade-in flex flex-col md:flex-row">
            
            {/* Form Input (Kiri) */}
            <div className={`p-8 md:p-10 ${dosisResult ? 'md:w-1/2 border-r border-gray-100' : 'w-full'}`}>
              <div className="mb-6"><h2 className="text-2xl font-extrabold text-red-900">Kondisi Klinis Pasien</h2></div>
              <form onSubmit={handlePredictDosis} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">GFR (mL/min)</label>
                    <input type="number" required className="w-full border rounded-lg p-2.5 text-sm" value={dosisData.gfr} onChange={(e) => setDosisData({...dosisData, gfr: e.target.value})} /></div>
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">Kelas CTP</label>
                    <select className="w-full border rounded-lg p-2.5 text-sm bg-white" value={dosisData.ctp} onChange={(e) => setDosisData({...dosisData, ctp: e.target.value})}>
                      <option value="A">A</option><option value="B">B</option><option value="C">C</option>
                    </select></div>
                </div>

                <div className="mt-4">
    <label className="block text-xs font-bold text-gray-700 mb-1">Rencana Beta-Blocker</label>
    <select className="w-full border rounded-lg p-2.5 text-sm bg-white" value={dosisData.jenis_betabloker} onChange={(e) => setDosisData({...dosisData, jenis_betabloker: e.target.value})}>
      <option value="propranolol">Propranolol</option>
      <option value="carvedilol">Carvedilol</option>
    </select>
  </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">MAP (mmHg) - Opsional</label>
                    <input type="number" className="w-full border rounded-lg p-2.5 text-sm" value={dosisData.map_value} onChange={(e) => setDosisData({...dosisData, map_value: e.target.value})} /></div>
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">Berat Badan (kg)</label>
                    <input type="number" className="w-full border rounded-lg p-2.5 text-sm" value={dosisData.berat_badan} onChange={(e) => setDosisData({...dosisData, berat_badan: e.target.value})} /></div>
                </div>

                {/* Toggles */}
                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Komplikasi & Kondisi Akut</p>
                  {[
                    {id: 'ascites_refrakter', label: 'Ascites Refrakter'}, {id: 'hrs', label: 'Hepatorenal Syndrome (HRS)'}, 
                    {id: 'gagal_ginjal_akut', label: 'Gagal Ginjal Akut (AKI)'}, {id: 'hiperkalemia_berat', label: 'Hiperkalemia Berat'}
                  ].map((tg) => (
                    <label key={tg.id} className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800" checked={(dosisData as any)[tg.id] === 1} onChange={(e) => setDosisData({...dosisData, [tg.id]: e.target.checked ? 1 : 0})} />
                      <span className="text-sm font-medium text-gray-700">{tg.label}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-3 bg-rose-50 p-4 rounded-xl border border-rose-100">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-red-800 rounded" checked={dosisData.ada_infeksi === 1} onChange={(e) => setDosisData({...dosisData, ada_infeksi: e.target.checked ? 1 : 0, butuh_antibiotik: e.target.checked ? 1 : 0})} />
                    <span className="text-sm font-bold text-red-900">Pasien Mengalami Infeksi (Butuh Antibiotik)</span>
                  </label>
                  {dosisData.ada_infeksi === 1 && (
                    <select className="w-full border rounded-lg p-2.5 text-sm bg-white mt-2" value={dosisData.jenis_antibiotik} onChange={(e) => setDosisData({...dosisData, jenis_antibiotik: e.target.value})}>
                      <option value="ampisilin_sulbaktam">Ampisilin-Sulbaktam</option>
                      <option value="levofloxacin">Levofloxacin</option>
                    </select>
                  )}
                </div>

                <button type="submit" disabled={loadingDosis} className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-3.5 rounded-xl shadow-md transition-all">{loadingDosis ? 'Memproses Rule Engine...' : 'Cek Rekomendasi Dosis'}</button>
              </form>
            </div>

            {/* Hasil Dosis (Kanan / Bawah) */}
            {dosisResult && (
              <div className="md:w-1/2 p-8 md:p-10 bg-gray-50 flex flex-col h-full border-t md:border-t-0 border-gray-200">
                <div className="mb-6">
                  <h2 className="text-xl font-extrabold text-red-900 mb-1">Hasil Rekomendasi</h2>
                  <p className="text-xs text-red-600 bg-red-100 inline-block px-2 py-1 rounded font-bold">⚠️ PROTOTIPE - Wajib Review Klinis</p>
                </div>
                
                <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(dosisResult).map(([key, data]: [string, any]) => (
                    <div key={key} className={`p-4 rounded-xl border ${data.status.includes('Hindari') ? 'bg-red-50 border-red-200' : data.status.includes('Kurangi') ? 'bg-amber-50 border-amber-200' : 'bg-white border-emerald-200 shadow-sm'}`}>
                      <h3 className="font-bold text-gray-900">{data.obat}</h3>
                      <div className="mt-2 flex items-center">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${data.status.includes('Hindari') ? 'bg-red-200 text-red-900' : data.status.includes('Kurangi') ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'}`}>{data.status}</span>
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

      {/* Modal Mortalitas (TETAP SAMA SEPERTI SEBELUMNYA) */}
      {showModal && prediction !== null && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
              <div className="bg-red-900 p-5 text-center"><h2 className="text-xl font-bold text-white">Laporan Hasil AI</h2></div>
              <div className="p-8">
                <div className={`text-center py-8 rounded-2xl mb-6 border ${prediction >= 0.4 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <p className="text-gray-600 font-semibold mb-2">Probabilitas Kematian</p>
                  <p className={`text-6xl font-black tracking-tight ${prediction >= 0.4 ? 'text-red-700' : 'text-emerald-600'}`}>{(prediction * 100).toFixed(1)}<span className="text-4xl">%</span></p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowModal(false)} className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 py-3 rounded-xl font-bold">Tutup</button>
                  <button onClick={handleSaveToDatabase} disabled={saving} className="flex-1 bg-red-800 hover:bg-red-900 text-white py-3 rounded-xl font-bold">{saving ? 'Menyimpan...' : 'Simpan ke Database'}</button>
                </div>
              </div>
            </div>
          </div>
      )}
    </main>
  );
}