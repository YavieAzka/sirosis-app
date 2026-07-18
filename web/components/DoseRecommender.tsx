// File: components/DoseRecommender.tsx
import React, { useState, useEffect } from 'react';
import { CtpParams, hitungSkorCtp, hitungGfrCkdEpi } from '../utils/clinical';
import CtpCalculator from './CtpCalculator';

export default function DoseRecommender() {
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

  // State terpisah untuk CKD dan AKI
  const [isCKD, setIsCKD] = useState(false);
  const [isAKI, setIsAKI] = useState(false);

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

  const [autoGfrDosis, setAutoGfrDosis] = useState(false);
  const [gfrParamsDosis, setGfrParamsDosis] = useState({ scr: '', age: '', gender: 'L' });

  useEffect(() => {
    if (autoGfrDosis && gfrParamsDosis.scr && gfrParamsDosis.age) {
      const scr = parseFloat(gfrParamsDosis.scr);
      const age = parseFloat(gfrParamsDosis.age);
      if (!isNaN(scr) && !isNaN(age) && scr > 0 && age > 0) {
        setDosisData(prev => ({ ...prev, gfr: hitungGfrCkdEpi(scr, age, gfrParamsDosis.gender as 'L'|'P') }));
      }
    }
  }, [autoGfrDosis, gfrParamsDosis.scr, gfrParamsDosis.age, gfrParamsDosis.gender]);

  const [autoMapDosis, setAutoMapDosis] = useState(false);
  const [mapParamsDosis, setMapParamsDosis] = useState({ sbp: '', dbp: '' });

  useEffect(() => {
    if (autoMapDosis && mapParamsDosis.sbp && mapParamsDosis.dbp) {
      const sbp = parseFloat(mapParamsDosis.sbp);
      const dbp = parseFloat(mapParamsDosis.dbp);
      if (!isNaN(sbp) && !isNaN(dbp) && sbp > 0 && dbp > 0) {
        const mapValue = (sbp + 2 * dbp) / 3;
        setDosisData(prev => ({ ...prev, map_value: mapValue.toFixed(2) }));
      }
    }
  }, [autoMapDosis, mapParamsDosis.sbp, mapParamsDosis.dbp]);

  const handleObatToggle = (obat: string) => {
    setDosisData(prev => ({ ...prev, obat_pilihan: { ...prev.obat_pilihan, [obat]: !(prev.obat_pilihan as any)[obat] } }));
  };

  const handleToggleAllObat = (checked: boolean) => {
    setDosisData(prev => ({
      ...prev, obat_pilihan: {
        spiro_furo: checked, spironolakton: checked, furosemid: checked,
        propranolol: checked, carvedilol: checked,
        ampisilin_sulbaktam: checked, azitromisin: checked, levofloxacin: checked
      }
    }));
  };

  const handlePredictDosis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingDosis(true);
    const selectedDrugsList = Object.entries(dosisData.obat_pilihan).filter(([_, isSelected]) => isSelected).map(([key]) => key);

    try {
      const res = await fetch('/api/dosis', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...dosisData, 
          // Gabungkan logika CKD dan AKI sebelum dikirim ke API
          gagal_ginjal_akut: (isCKD || isAKI) ? 1 : 0,
          obat_pilihan: selectedDrugsList 
        }),
      });
      const data = await res.json();
      if (res.ok) setDosisResult(data);
      else alert(data.error || 'Terjadi kesalahan sistem dosis.');
    } catch (error) { alert('Gagal menghubungi server rekomendasi.'); } 
    finally { setLoadingDosis(false); }
  };

  return (
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
                    
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col">
                        <p className="text-xs font-bold text-blue-900 mb-3 border-b border-blue-200 pb-2">Diuretik</p>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-start space-x-3 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 mt-0.5 text-blue-700 rounded focus:ring-blue-700 cursor-pointer" checked={dosisData.obat_pilihan.spiro_furo} onChange={() => handleObatToggle('spiro_furo')} />
                                <span className="text-sm font-semibold text-gray-700 leading-tight group-hover:text-blue-900 transition-colors">Kombinasi (Spiro+Furo)</span>
                            </label>
                            <label className="flex items-start space-x-3 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 mt-0.5 text-blue-700 rounded focus:ring-blue-700 cursor-pointer" checked={dosisData.obat_pilihan.spironolakton} onChange={() => handleObatToggle('spironolakton')} />
                                <span className="text-sm font-semibold text-gray-700 leading-tight group-hover:text-blue-900 transition-colors">Spironolakton Tunggal</span>
                            </label>
                            <label className="flex items-start space-x-3 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 mt-0.5 text-blue-700 rounded focus:ring-blue-700 cursor-pointer" checked={dosisData.obat_pilihan.furosemid} onChange={() => handleObatToggle('furosemid')} />
                                <span className="text-sm font-semibold text-gray-700 leading-tight group-hover:text-blue-900 transition-colors">Furosemid Tunggal</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex flex-col">
                        <p className="text-xs font-bold text-emerald-900 mb-3 border-b border-emerald-200 pb-2">Beta-Bloker</p>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-start space-x-3 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 mt-0.5 text-emerald-700 rounded focus:ring-emerald-700 cursor-pointer" checked={dosisData.obat_pilihan.propranolol} onChange={() => handleObatToggle('propranolol')} />
                                <span className="text-sm font-semibold text-gray-700 leading-tight group-hover:text-emerald-900 transition-colors">Propranolol</span>
                            </label>
                            <label className="flex items-start space-x-3 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 mt-0.5 text-emerald-700 rounded focus:ring-emerald-700 cursor-pointer" checked={dosisData.obat_pilihan.carvedilol} onChange={() => handleObatToggle('carvedilol')} />
                                <span className="text-sm font-semibold text-gray-700 leading-tight group-hover:text-emerald-900 transition-colors">Carvedilol</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 col-span-1 md:col-span-2 flex flex-col">
                        <p className="text-xs font-bold text-rose-900 mb-3 border-b border-rose-200 pb-2">Antibiotik (Bila Terdapat Indikasi Infeksi)</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <label className="flex items-start space-x-3 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 mt-0.5 text-rose-700 rounded focus:ring-rose-700 cursor-pointer" checked={dosisData.obat_pilihan.ampisilin_sulbaktam} onChange={() => handleObatToggle('ampisilin_sulbaktam')} />
                                <span className="text-sm font-semibold text-gray-700 leading-tight group-hover:text-rose-900 transition-colors">Ampisilin-Sulbaktam</span>
                            </label>
                            <label className="flex items-start space-x-3 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 mt-0.5 text-rose-700 rounded focus:ring-rose-700 cursor-pointer" checked={dosisData.obat_pilihan.levofloxacin} onChange={() => handleObatToggle('levofloxacin')} />
                                <span className="text-sm font-semibold text-gray-700 leading-tight group-hover:text-rose-900 transition-colors">Levofloxacin</span>
                            </label>
                            <label className="flex items-start space-x-3 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 mt-0.5 text-rose-700 rounded focus:ring-rose-700 cursor-pointer" checked={dosisData.obat_pilihan.azitromisin} onChange={() => handleObatToggle('azitromisin')} />
                                <span className="text-sm font-semibold text-gray-700 leading-tight group-hover:text-rose-900 transition-colors">Azitromisin</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                        <label className="text-sm font-bold text-gray-700">Nilai GFR / CKD-EPI (mL/min)</label>
                        <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                        <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800" checked={autoGfrDosis} onChange={(e) => setAutoGfrDosis(e.target.checked)} />
                        <span className="text-xs font-bold text-red-900">Hitung Otomatis (CKD-EPI 2021)</span>
                        </label>
                    </div>
                    {autoGfrDosis && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-white rounded-xl border border-red-100 shadow-inner">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Serum Kreatinin (mg/dL)</label>
                            <input type="number" step="any" required={autoGfrDosis} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-800 focus:border-red-800 bg-white" placeholder="Contoh: 1.1" value={gfrParamsDosis.scr} onChange={e => setGfrParamsDosis({...gfrParamsDosis, scr: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Usia (Tahun)</label>
                            <input type="number" step="any" required={autoGfrDosis} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-800 focus:border-red-800 bg-white" placeholder="Contoh: 45" value={gfrParamsDosis.age} onChange={e => setGfrParamsDosis({...gfrParamsDosis, age: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Jenis Kelamin</label>
                            <select className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-800 focus:border-red-800 bg-white" value={gfrParamsDosis.gender} onChange={e => setGfrParamsDosis({...gfrParamsDosis, gender: e.target.value})}>
                            <option value="L">Laki-laki</option><option value="P">Perempuan</option>
                            </select>
                        </div>
                        </div>
                    )}
                    <input type="number" step="any" required 
                        className={`w-full border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800 transition-all ${autoGfrDosis ? 'bg-gray-100 text-red-900 font-bold cursor-not-allowed shadow-inner' : 'bg-white text-gray-900'}`}
                        placeholder={autoGfrDosis ? "Otomatis terkalkulasi..." : "Contoh: 85.5"}
                        value={dosisData.gfr} readOnly={autoGfrDosis} onChange={(e) => !autoGfrDosis && setDosisData({...dosisData, gfr: e.target.value})} />
                </div>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                        <label className="text-sm font-bold text-gray-700">MAP (mmHg) - Opsional</label>
                        <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                        <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800" checked={autoMapDosis} onChange={(e) => setAutoMapDosis(e.target.checked)} />
                        <span className="text-xs font-bold text-red-900">Hitung Otomatis dari Tekanan Darah</span>
                        </label>
                    </div>
                    {autoMapDosis && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-white rounded-xl border border-red-100 shadow-inner">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Sistolik / SBP (mmHg)</label>
                            <input type="number" step="any" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-800 focus:border-red-800 bg-white" placeholder="Contoh: 120" value={mapParamsDosis.sbp} onChange={e => setMapParamsDosis({...mapParamsDosis, sbp: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Diastolik / DBP (mmHg)</label>
                            <input type="number" step="any" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-800 focus:border-red-800 bg-white" placeholder="Contoh: 80" value={mapParamsDosis.dbp} onChange={e => setMapParamsDosis({...mapParamsDosis, dbp: e.target.value})} />
                        </div>
                        </div>
                    )}
                    <input type="number" step="any" 
                        className={`w-full border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800 transition-all ${autoMapDosis ? 'bg-gray-100 text-red-900 font-bold cursor-not-allowed shadow-inner' : 'bg-white text-gray-900'}`}
                        placeholder={autoMapDosis ? "Otomatis terkalkulasi..." : "Contoh: 80.5"}
                        value={dosisData.map_value} readOnly={autoMapDosis} onChange={(e) => !autoMapDosis && setDosisData({...dosisData, map_value: e.target.value})} />
                </div>
            </div>

            <CtpCalculator active={autoCtpDosis} onToggle={setAutoCtpDosis} params={ctpParamsDosis} onChangeParam={(key, value) => setCtpParamsDosis(prev => ({ ...prev, [key]: value }))} hasil={skorCtpDosis}>
                <div className="space-y-2 mt-4 border-t border-gray-200 pt-4">
                    <label className="block text-sm font-bold text-gray-700">Kelas CTP (Input Manual)</label>
                    <select 
                        className={`w-full border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800 transition-all ${autoCtpDosis ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-inner' : 'bg-white text-gray-900'}`} 
                        value={dosisData.ctp} disabled={autoCtpDosis}
                        onChange={(e) => !autoCtpDosis && setDosisData({...dosisData, ctp: e.target.value})}
                    >
                        <option value="A">Kelas A</option><option value="B">Kelas B</option><option value="C">Kelas C</option>
                    </select>
                </div>
            </CtpCalculator>

            <div className="space-y-3 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3 uppercase tracking-wider">Komplikasi & Kondisi Akut</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* 
                  Opsi gagal_ginjal_akut dihapus dari array map di bawah ini 
                  dan digantikan secara manual agar CKD dan AKI terpisah.
                */}
                {[ 
                    {id: 'ascites_refrakter', label: 'Ascites Refrakter'}, 
                    {id: 'hrs', label: 'Hepatorenal Syndrome (HRS)'}, 
                    {id: 'sepsis_pneumonia', label: 'Sepsis atau Pneumonia'},
                    {id: 'ast_alt_tinggi', label: 'AST/ALT > 2x Normal'}
                ].map((tg) => (
                    <label key={tg.id} className="flex items-start space-x-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 mt-0.5 text-red-800 rounded focus:ring-red-800 cursor-pointer" checked={(dosisData as any)[tg.id] === 1} onChange={(e) => setDosisData({...dosisData, [tg.id]: e.target.checked ? 1 : 0})} />
                    <span className="text-sm font-medium text-gray-700 leading-tight group-hover:text-red-900 transition-colors">{tg.label}</span>
                    </label>
                ))}

                {/* Checkbox CKD (Baru) */}
                <label className="flex items-start space-x-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 mt-0.5 text-red-800 rounded focus:ring-red-800 cursor-pointer" checked={isCKD} onChange={(e) => setIsCKD(e.target.checked)} />
                    <span className="text-sm font-medium text-gray-700 leading-tight group-hover:text-red-900 transition-colors">Chronic Kidney Disease (CKD)</span>
                </label>
                
                {/* Checkbox AKI (Baru) */}
                <label className="flex items-start space-x-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 mt-0.5 text-red-800 rounded focus:ring-red-800 cursor-pointer" checked={isAKI} onChange={(e) => setIsAKI(e.target.checked)} />
                    <span className="text-sm font-medium text-gray-700 leading-tight group-hover:text-red-900 transition-colors">Acute Kidney Injury (AKI)</span>
                </label>

                </div>
            </div>

            <button type="submit" disabled={loadingDosis} className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-4 rounded-xl shadow-lg transition-all">{loadingDosis ? 'Memproses Rule Engine...' : 'Cek Rekomendasi Dosis'}</button>
        </form>
        </div>

        {dosisResult && (
        <div className="md:w-1/2 p-8 md:p-10 bg-gray-50 flex flex-col h-full border-t md:border-t-0 border-gray-200">
            <div className="mb-6">
            <h2 className="text-xl font-extrabold text-red-900 mb-1">Hasil Rekomendasi</h2>
            <p className="text-xs text-red-600 bg-red-100 inline-block px-2 py-1 rounded font-bold">⚠️ PERINGATAN - Wajib Review Klinis</p>
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
  );
}