'use client';

import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    komor_sepsis: 0,
    urea_baseline: '',
    natrium_baseline: '',
    komp_eh: 0,
    inr_baseline: '',
    sgot_baseline: '',
    gfr: '',
    ctp_encoded: 1,
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      komor_sepsis: Number(formData.komor_sepsis),
      urea_baseline: Number(formData.urea_baseline),
      natrium_baseline: Number(formData.natrium_baseline),
      komp_eh: Number(formData.komp_eh),
      inr_baseline: Number(formData.inr_baseline),
      sgot_baseline: Number(formData.sgot_baseline),
      gfr: Number(formData.gfr),
      ctp_encoded: Number(formData.ctp_encoded),
    };

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (data.probability !== undefined) {
        setPrediction(data.probability);
        setShowModal(true);
      } else {
        alert(data.error || 'Terjadi kesalahan internal.');
      }
    } catch (error) {
      alert('Gagal menghubungi server prediksi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDatabase = async () => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        komor_sepsis: Number(formData.komor_sepsis),
        urea_baseline: Number(formData.urea_baseline),
        natrium_baseline: Number(formData.natrium_baseline),
        komp_eh: Number(formData.komp_eh),
        inr_baseline: Number(formData.inr_baseline),
        sgot_baseline: Number(formData.sgot_baseline),
        gfr: Number(formData.gfr),
        ctp_encoded: Number(formData.ctp_encoded),
      };

      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        alert('Data berhasil disimpan ke database Supabase!');
        setShowModal(false);
      } else {
        alert('Gagal menyimpan ke database.');
      }
    } catch (error) {
      alert('Gagal menghubungi server database.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 font-sans py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* HEADER BERGAYA MERAH HATI */}
        <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-800 p-8 text-center shadow-inner">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
            Kalkulator Prognosis Sirosis Hati
          </h1>
          <p className="text-red-100 mt-3 text-sm md:text-base font-medium opacity-90">
            Instrumen AI Prediksi Outcome Klinis (Mortalitas)
          </p>
        </div>
        
        <form onSubmit={handlePredict} className="p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Sepsis */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Status Sepsis</label>
              <select 
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-all shadow-sm outline-none cursor-pointer"
                value={formData.komor_sepsis}
                onChange={(e) => setFormData({...formData, komor_sepsis: Number(e.target.value)})}
              >
                <option value={0}>Tidak Ada (0)</option>
                <option value={1}>Ya, Sepsis (1)</option>
              </select>
            </div>

            {/* Ensefalopati Hepatikum */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Ensefalopati Hepatikum</label>
              <select 
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-all shadow-sm outline-none cursor-pointer"
                value={formData.komp_eh}
                onChange={(e) => setFormData({...formData, komp_eh: Number(e.target.value)})}
              >
                <option value={0}>Tidak Ada (0)</option>
                <option value={1}>Ya (1)</option>
              </select>
            </div>

            {/* Skor CTP */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Skor CTP (Child-Turcotte-Pugh)</label>
              <select 
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-all shadow-sm outline-none cursor-pointer"
                value={formData.ctp_encoded}
                onChange={(e) => setFormData({...formData, ctp_encoded: Number(e.target.value)})}
              >
                <option value={1}>Kelas A</option>
                <option value={2}>Kelas B</option>
                <option value={3}>Kelas C</option>
              </select>
            </div>

            {/* Urea Baseline */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Urea Baseline <span className="font-normal text-gray-500">(mg/dL)</span></label>
              <input type="number" step="any" required 
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-all shadow-sm outline-none"
                placeholder="Contoh: 45.5"
                value={formData.urea_baseline} onChange={(e) => setFormData({...formData, urea_baseline: e.target.value})} />
            </div>

            {/* Natrium Baseline */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Natrium Baseline <span className="font-normal text-gray-500">(mEq/L)</span></label>
              <input type="number" step="any" required 
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-all shadow-sm outline-none"
                placeholder="Contoh: 135.0"
                value={formData.natrium_baseline} onChange={(e) => setFormData({...formData, natrium_baseline: e.target.value})} />
            </div>

            {/* INR Baseline */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">INR Baseline</label>
              <input type="number" step="any" required 
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-all shadow-sm outline-none"
                placeholder="Contoh: 1.2"
                value={formData.inr_baseline} onChange={(e) => setFormData({...formData, inr_baseline: e.target.value})} />
            </div>

            {/* SGOT Baseline */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">SGOT Baseline <span className="font-normal text-gray-500">(U/L)</span></label>
              <input type="number" step="any" required 
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-all shadow-sm outline-none"
                placeholder="Contoh: 120.0"
                value={formData.sgot_baseline} onChange={(e) => setFormData({...formData, sgot_baseline: e.target.value})} />
            </div>

            {/* GFR */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">GFR / CKD-EPI <span className="font-normal text-gray-500">(mL/min)</span></label>
              <input type="number" step="any" required 
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-all shadow-sm outline-none"
                placeholder="Contoh: 90.5"
                value={formData.gfr} onChange={(e) => setFormData({...formData, gfr: e.target.value})} />
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-red-800 hover:bg-red-900 active:bg-red-950 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3 text-lg"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengkalkulasi Probabilitas...
                </>
              ) : 'Hitung Probabilitas Mortalitas'}
            </button>
          </div>
        </form>

        {/* MODAL HASIL & KONFIRMASI DENGAN BLUR BACKGROUND */}
        {showModal && prediction !== null && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden transform transition-all scale-100 opacity-100">
              
              <div className="bg-red-900 p-5 text-center">
                <h2 className="text-xl font-bold text-white">Laporan Hasil AI</h2>
              </div>
              
              <div className="p-8">
                <div className={`text-center py-8 rounded-2xl mb-6 border ${prediction >= 0.4 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <p className="text-gray-600 font-semibold mb-2">Probabilitas Kematian</p>
                  <p className={`text-6xl font-black tracking-tight ${prediction >= 0.4 ? 'text-red-700' : 'text-emerald-600'}`}>
                    {(prediction * 100).toFixed(1)}<span className="text-4xl">%</span>
                  </p>
                  <div className="mt-4 inline-block px-4 py-1 rounded-full bg-white shadow-sm border border-gray-100">
                    <p className="text-sm font-bold text-gray-800">
                      Saran: <span className={prediction >= 0.4 ? 'text-red-600' : 'text-emerald-600'}>
                        {prediction >= 0.4 ? 'Risiko Tinggi (Observasi Ketat)' : 'Risiko Rendah'}
                      </span>
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-8 text-center leading-relaxed">
                  Apakah data tes ini perlu direkam ke <b>Database Supabase</b> untuk memperkaya dataset pelatihan model di masa depan?
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-3 rounded-xl font-bold transition-colors focus:ring-2 focus:ring-gray-200"
                  >
                    Tutup
                  </button>
                  <button 
                    onClick={handleSaveToDatabase} 
                    disabled={saving} 
                    className="flex-1 bg-red-800 hover:bg-red-900 text-white py-3 rounded-xl font-bold transition-colors shadow-md disabled:opacity-70 focus:ring-2 focus:ring-red-900 focus:ring-offset-2"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan ke Database'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}