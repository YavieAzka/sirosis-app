// File: components/LosPredictor.tsx
import React, { useState, useEffect } from "react";
import {
  CtpParams,
  hitungSkorCtp,
  hitungGfrCkdEpi,
} from "../../../utils/clinical";
import CtpCalculator from "./CtpCalculator";

export default function LosPredictor({ dict }: { dict: any }) {
  const [tokenInput, setTokenInput] = useState("");
  const [formDataLos, setFormDataLos] = useState({
    komor_sepsis: 0,
    komp_eh: 0,
    ctp_encoded: 1,
    bilirubin_baseline: "",
    kreatinin_baseline: "",
    inr_baseline: "",
    sgot_baseline: "",
    usia: "",
    gfr: "",
    jk: "L",
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
        setFormDataLos((prev) => ({
          ...prev,
          gfr: hitungGfrCkdEpi(scr, age, formDataLos.jk as "L" | "P"),
        }));
      }
    }
  }, [
    autoGfrLos,
    formDataLos.kreatinin_baseline,
    formDataLos.usia,
    formDataLos.jk,
  ]);

  const [autoCtpLos, setAutoCtpLos] = useState(false);
  const [ctpParamsLos, setCtpParamsLos] = useState<CtpParams>({
    bilirubin: "",
    albumin: "",
    inr: "",
    ascites: "",
    encephalopathy: "",
  });
  const skorCtpLos = hitungSkorCtp(ctpParamsLos);

  useEffect(() => {
    if (autoCtpLos && skorCtpLos) {
      const ctpEncodedMap: Record<"A" | "B" | "C", number> = {
        A: 1,
        B: 2,
        C: 3,
      };
      const ctpEncodedBaru = ctpEncodedMap[skorCtpLos.kelas];
      const komplEhBaru = Number(ctpParamsLos.encephalopathy) >= 2 ? 1 : 0;
      setFormDataLos((prev) => {
        if (prev.ctp_encoded === ctpEncodedBaru && prev.komp_eh === komplEhBaru)
          return prev;
        return { ...prev, ctp_encoded: ctpEncodedBaru, komp_eh: komplEhBaru };
      });
    }
  }, [autoCtpLos, skorCtpLos?.kelas, ctpParamsLos.encephalopathy]);

  const handlePredictLos = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingLos(true);
    const payload = {
      ...formDataLos,
      komor_sepsis: Number(formDataLos.komor_sepsis),
      komp_eh: Number(formDataLos.komp_eh),
      bilirubin_baseline: Number(formDataLos.bilirubin_baseline),
      kreatinin_baseline: Number(formDataLos.kreatinin_baseline),
      inr_baseline: Number(formDataLos.inr_baseline),
      sgot_baseline: Number(formDataLos.sgot_baseline),
      usia: Number(formDataLos.usia),
      gfr: Number(formDataLos.gfr),
      ctp_encoded: Number(formDataLos.ctp_encoded),
    };

    try {
      const res = await fetch("/api/predict_los", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.probability_los !== undefined) {
        setPredictionLos(data.probability_los);
        setShowModalLos(true);
      } else {
        alert(data.error || "Terjadi kesalahan internal.");
      }
    } catch (error) {
      alert("Gagal menghubungi server AI.");
    } finally {
      setLoadingLos(false);
    }
  };

  const handleSaveToDatabaseLos = async () => {
    if (!tokenInput) {
      alert("Masukkan Token Rahasia terlebih dahulu!");
      return;
    }
    setSavingLos(true);
    const payload = {
      ...formDataLos,
      komor_sepsis: Number(formDataLos.komor_sepsis),
      komp_eh: Number(formDataLos.komp_eh),
      usia: Number(formDataLos.usia),
      kreatinin_baseline: Number(formDataLos.kreatinin_baseline),
      bilirubin_baseline: Number(formDataLos.bilirubin_baseline),
      inr_baseline: Number(formDataLos.inr_baseline),
      sgot_baseline: Number(formDataLos.sgot_baseline),
      gfr: Number(formDataLos.gfr),
      ctp_encoded: Number(formDataLos.ctp_encoded),
      probability_los: predictionLos,
      token: tokenInput,
    };

    try {
      const res = await fetch("/database/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Data LoS berhasil disimpan!");
        setShowModalLos(false);
        setTokenInput("");
      } else {
        alert(data.error || "Gagal menyimpan. Pastikan token benar.");
      }
    } catch (error) {
      alert("Gagal menghubungi database.");
    } finally {
      setSavingLos(false);
    }
  };

  const calculateMeld = (
    bil: string | number,
    inr: string | number,
    cr: string | number,
  ) => {
    const b = parseFloat(String(bil));
    const i = parseFloat(String(inr));
    const c = parseFloat(String(cr));

    // Validasi: Logaritma natural ln(x) hanya terdefinisi jika x > 0
    if (!isNaN(b) && !isNaN(i) && !isNaN(c) && b > 0 && i > 0 && c > 0) {
      // Formula: 3.78 * ln[Bilirubin] + 11.2 * ln[INR] + 9.57 * ln[Creatinine] + 6.43
      let meldScore =
        3.78 * Math.log(b) + 11.2 * Math.log(i) + 9.57 * Math.log(c) + 6.43;

      return meldScore.toFixed(2); // Dibulatkan 2 angka di belakang koma
    }

    return null;
  };

  // Menangkap hasil kalkulasi secara real-time
  const meldResult = calculateMeld(
    formDataLos.bilirubin_baseline,
    formDataLos.inr_baseline,
    formDataLos.kreatinin_baseline,
  );

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-800 p-8 text-center shadow-inner">
        <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
          Kalkulator Lama Rawat (LoS)
        </h1>
      </div>

      <form onSubmit={handlePredictLos} className="p-8 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              Status Sepsis
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800"
              value={formDataLos.komor_sepsis}
              onChange={(e) =>
                setFormDataLos({
                  ...formDataLos,
                  komor_sepsis: Number(e.target.value),
                })
              }
            >
              <option value={0}>Tidak Ada (0)</option>
              <option value={1}>Ya, Sepsis (1)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              Ensefalopati Hepatikum
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800"
              value={formDataLos.komp_eh}
              onChange={(e) =>
                setFormDataLos({
                  ...formDataLos,
                  komp_eh: Number(e.target.value),
                })
              }
            >
              <option value={0}>Tidak Ada (0)</option>
              <option value={1}>Ya (1)</option>
            </select>
          </div>

          <div className="col-span-1 md:col-span-2">
            <CtpCalculator
              active={autoCtpLos}
              onToggle={setAutoCtpLos}
              params={ctpParamsLos}
              onChangeParam={(key, value) =>
                setCtpParamsLos((prev) => ({ ...prev, [key]: value }))
              }
              hasil={skorCtpLos}
              dict={dict}
            >
              <div className="space-y-2 mt-4 border-t border-gray-200 pt-4">
                <label className="block text-sm font-bold text-gray-700">
                  Skor CTP (Input Manual)
                </label>
                <select
                  className={`w-full border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800 transition-all ${autoCtpLos ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-inner" : "bg-white text-gray-900"}`}
                  value={formDataLos.ctp_encoded}
                  disabled={autoCtpLos}
                  onChange={(e) =>
                    !autoCtpLos &&
                    setFormDataLos({
                      ...formDataLos,
                      ctp_encoded: Number(e.target.value),
                    })
                  }
                >
                  <option value={1}>Kelas A</option>
                  <option value={2}>Kelas B</option>
                  <option value={3}>Kelas C</option>
                </select>
              </div>
            </CtpCalculator>
          </div>

          {[
            { id: "usia", label: "Usia (Tahun)", ph: "Contoh: 45" },
            {
              id: "kreatinin_baseline",
              label: "Kreatinin Baseline (mg/dL)",
              ph: "Contoh: 1.1",
            },
            {
              id: "bilirubin_baseline",
              label: "Bilirubin Baseline (mg/dL)",
              ph: "Contoh: 1.5",
            },
            { id: "inr_baseline", label: "INR Baseline", ph: "Contoh: 1.2" },
            {
              id: "sgot_baseline",
              label: "SGOT Baseline (U/L)",
              ph: "Contoh: 45.5",
            },
          ].map((f) => (
            <div key={f.id} className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                {f.label}
              </label>
              <input
                type="number"
                step="any"
                required
                className="w-full bg-white border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800"
                placeholder={f.ph}
                value={(formDataLos as any)[f.id]}
                onChange={(e) =>
                  setFormDataLos({ ...formDataLos, [f.id]: e.target.value })
                }
              />
            </div>
          ))}

          <div className="col-span-1 md:col-span-2 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm mt-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
              <label className="text-sm font-bold text-gray-700">
                Nilai GFR / CKD-EPI (mL/min)
              </label>
              <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-red-800 rounded focus:ring-red-800"
                  checked={autoGfrLos}
                  onChange={(e) => setAutoGfrLos(e.target.checked)}
                />
                <span className="text-xs font-bold text-red-900">
                  Hitung Otomatis dari Kreatinin & Usia
                </span>
              </label>
            </div>

            {autoGfrLos && (
              <div className="mb-4 p-4 bg-white rounded-xl border border-red-100 shadow-inner">
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Jenis Kelamin (untuk Formula CKD-EPI)
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-800 bg-white"
                  value={formDataLos.jk}
                  onChange={(e) =>
                    setFormDataLos({ ...formDataLos, jk: e.target.value })
                  }
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
                <p className="text-xs text-gray-500 mt-2 italic">
                  *Nilai Kreatinin dan Usia akan ditarik secara otomatis dari
                  input form di atas.
                </p>
              </div>
            )}

            <input
              type="number"
              step="any"
              required
              className={`w-full border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-red-800 transition-all ${autoGfrLos ? "bg-gray-100 text-red-900 font-bold cursor-not-allowed shadow-inner" : "bg-white text-gray-900"}`}
              placeholder={
                autoGfrLos ? "Otomatis terkalkulasi..." : "Contoh: 85.5"
              }
              value={formDataLos.gfr}
              readOnly={autoGfrLos}
              onChange={(e) =>
                !autoGfrLos &&
                setFormDataLos({ ...formDataLos, gfr: e.target.value })
              }
            />
          </div>
        </div>
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-red-50 to-rose-50 p-5 rounded-xl border border-red-200 shadow-sm mt-4 flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-sm font-bold text-red-900 mb-1 uppercase tracking-wide">
              Model for End-Stage Liver Disease (MELD)
            </h3>
            <p className="text-xs text-red-700/80 font-medium">
              Kalkulasi otomatis berdasarkan input{" "}
              <span className="font-bold">Bilirubin</span>,{" "}
              <span className="font-bold">INR</span>, dan{" "}
              <span className="font-bold">Serum Kreatinin</span>.
            </p>
          </div>

          <div className="bg-white px-8 py-4 rounded-xl border border-red-100 shadow-inner flex items-center justify-center min-w-[140px]">
            {meldResult !== null ? (
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-red-800 drop-shadow-sm">
                  {meldResult}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                  Skor
                </span>
              </div>
            ) : (
              <span className="text-xs font-bold text-gray-400 text-center">
                Menunggu <br /> input lengkap...
              </span>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={loadingLos}
          className="w-full mt-10 bg-red-800 hover:bg-red-900 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
        >
          {loadingLos ? "Mengkalkulasi..." : "Analisis Prediksi Lama Rawat"}
        </button>
      </form>

      {/* Modal Result LoS */}
      {showModalLos && predictionLos !== null && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-red-900 p-5 text-center">
              <h2 className="text-xl font-bold text-white tracking-wide">
                Laporan Prediksi Lama Rawat
              </h2>
            </div>
            <div className="p-8">
              <div
                className={`text-center py-8 rounded-2xl mb-6 border shadow-inner ${predictionLos >= 0.5 ? "bg-amber-50 border-amber-200" : "bg-blue-50 border-blue-200"}`}
              >
                <p className="text-gray-600 font-semibold mb-2 uppercase tracking-widest text-xs">
                  Risiko Rawat Inap &gt; 7 Hari
                </p>
                <p
                  className={`text-6xl font-black tracking-tight ${predictionLos >= 0.5 ? "text-amber-700" : "text-blue-600"}`}
                >
                  {(predictionLos * 100).toFixed(1)}
                  <span className="text-4xl">%</span>
                </p>
              </div>

              <div className="mb-5 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider text-center">
                  Otorisasi Simpan Data
                </label>
                <input
                  type="password"
                  placeholder="Masukkan Token Rahasia"
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-800 focus:border-red-800 text-center tracking-widest bg-white"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowModalLos(false);
                    setTokenInput("");
                  }}
                  className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 py-3 rounded-xl font-bold transition-colors"
                >
                  Tutup
                </button>
                <button
                  onClick={handleSaveToDatabaseLos}
                  disabled={savingLos}
                  className="flex-1 bg-red-800 hover:bg-red-900 text-white py-3 rounded-xl font-bold shadow-md transition-all"
                >
                  {savingLos ? "Menyimpan..." : "Simpan ke Database"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
