// File: app/[lang]/components/AboutProject.tsx
"use client";

import React from "react";
import {
  HeartPulse,
  Hospital,
  Pill,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  FileText,
  Activity,
  CheckCircle2,
  Stethoscope,
  BookOpen,
  Mail,
  ChevronRight,
  Database,
  Cpu,
  HelpCircle,
} from "lucide-react";

interface AboutProjectProps {
  dict: any;
  lang?: string;
  onNavigate?: (view: "app" | "guide" | "methodology" | "about") => void;
}

export default function AboutProject({
  dict,
  lang = "id",
  onNavigate,
}: AboutProjectProps) {
  const isEn = lang === "en";

  const promotors = [
    {
      id: 1,
      name: "Prof. apt. Fatma Sri Wahyuni, Ph.D",
      role: isEn ? "Promoter • Professor of Pharmacology" : "Promotor • Guru Besar Farmakologi",
      institution: isEn ? "Faculty of Pharmacy, Universitas Andalas" : "Fakultas Farmasi, Universitas Andalas",
    },
    {
      id: 2,
      name: "apt. Yelly Oktavia Sari, M.Pharm, Ph.D",
      role: isEn ? "Co-Promoter I • Clinical Pharmacy Expert" : "Ko-Promotor I • Pakar Farmasi Klinis",
      institution: isEn ? "Faculty of Pharmacy, Universitas Andalas" : "Fakultas Farmasi, Universitas Andalas",
    },
    {
      id: 3,
      name: "Dr. dr. Saptino Miro, Sp.PD, Subsp. G.E.H(K), FINASIM",
      role: isEn ? "Co-Promoter II • Consultant Gastroenterologist & Hepatologist" : "Ko-Promotor II • Konsultan Gastroenterohepatologi",
      institution: isEn ? "RSUP Dr. M. Djamil / Faculty of Medicine Unand" : "RSUP Dr. M. Djamil / Fak. Kedokteran Unand",
    },
    {
      id: 4,
      name: "Dr. apt. Hansen Nasif, S.Si, Sp. FRS",
      role: isEn ? "Co-Promoter III • Hospital Pharmacy Specialist" : "Ko-Promotor III • Spesialis Farmasi Rumah Sakit",
      institution: isEn ? "Faculty of Pharmacy, Universitas Andalas" : "Fakultas Farmasi, Universitas Andalas",
    },
  ];

  const handleGoToCalculator = () => {
    if (onNavigate) {
      onNavigate("app");
    }
  };

  const handleGoToMethodology = () => {
    if (onNavigate) {
      onNavigate("methodology");
    }
  };

  const handleGoToGuide = () => {
    if (onNavigate) {
      onNavigate("guide");
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12 animate-fade-in text-gray-800">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION & DIRECT ACTION CTA */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-950 via-red-900 to-rose-950 text-white p-8 sm:p-12 md:p-16 shadow-2xl border border-red-800/40">
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-900/70 border border-red-700/60 text-red-100 text-xs font-extrabold uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5 text-red-300 animate-pulse" />
            <span>
              {isEn
                ? "Clinical Decision Support System • Powered by Explainable AI"
                : "Clinical Decision Support System • Berbasis Explainable AI"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            CirrhoSmart <span className="text-red-300">AI</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-red-100/90 leading-relaxed font-normal">
            {isEn
              ? "An evidence-based Clinical Decision Support System (CDSS) for in-hospital mortality risk stratification, length of stay prediction, and personalized pharmacotherapy dose optimization in hospitalized liver cirrhosis patients."
              : "Platform Clinical Decision Support System (CDSS) berbasis kecerdasan buatan terintegrasi untuk stratifikasi risiko mortalitas rumah sakit, prediksi lama rawat inap (LoS), dan optimasi penyesuaian dosis obat terpersonalisasi pada pasien sirosis hati."}
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleGoToCalculator}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-red-950 hover:bg-red-50 hover:text-red-900 text-sm sm:text-base font-extrabold transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-95 group cursor-pointer"
            >
              <HeartPulse className="w-5 h-5 text-red-700 transition-transform group-hover:scale-110" />
              <span>{isEn ? "Open Clinical Calculator" : "Buka Kalkulator Klinis"}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={handleGoToMethodology}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-red-900/60 hover:bg-red-800/80 text-white border border-red-700/60 text-sm sm:text-base font-bold transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-red-200" />
              <span>{isEn ? "Research Methodology" : "Metodologi Riset"}</span>
            </button>

            <button
              type="button"
              onClick={handleGoToGuide}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-red-900/60 hover:bg-red-800/80 text-white border border-red-700/60 text-sm sm:text-base font-bold transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-red-200" />
              <span>{isEn ? "User Guide" : "Panduan Penggunaan"}</span>
            </button>
          </div>
        </div>

        {/* Subtle background decorative shapes */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-red-800/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-80 h-80 bg-rose-700/15 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* ========================================================================= */}
      {/* 2. KEY METRICS & TRUST SIGNALS */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-red-900 mb-2">
            <Users className="w-5 h-5 text-red-700" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 bg-red-50 px-2 py-0.5 rounded">
              {isEn ? "Real Cohort" : "Kohort Nyata"}
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-mono tabular-nums">583</p>
          <p className="text-xs font-bold text-gray-700">{isEn ? "Inpatient Cohort" : "Pasien Rawat Inap"}</p>
          <p className="text-[11px] text-gray-500 leading-tight">
            {isEn ? "RSUP Dr. M. Djamil Padang (2021–2023)" : "RSUP Dr. M. Djamil Padang (2021–2023)"}
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-red-900 mb-2">
            <Award className="w-5 h-5 text-red-700" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 bg-red-50 px-2 py-0.5 rounded">
              Random Forest
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-red-900 font-mono tabular-nums">0.8391</p>
          <p className="text-xs font-bold text-gray-700">{isEn ? "Mortality AUROC" : "AUROC Model Mortalitas"}</p>
          <p className="text-[11px] text-gray-500 leading-tight">
            {isEn ? "Sensitivity 83.33% • NPV 97.47%" : "Sensitivitas 83.33% • NPV 97.47%"}
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-red-900 mb-2">
            <ShieldCheck className="w-5 h-5 text-red-700" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 bg-red-50 px-2 py-0.5 rounded">
              Adjudication
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">84.2%</p>
          <p className="text-xs font-bold text-gray-700">{isEn ? "Dose Concordance" : "Konkordansi Dosis Klinis"}</p>
          <p className="text-[11px] text-gray-500 leading-tight">
            {isEn ? "Validated on 19 essential drugs" : "Adjudikasi konsensus 19 obat esensial"}
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-red-900 mb-2">
            <FileText className="w-5 h-5 text-red-700" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 bg-red-50 px-2 py-0.5 rounded">
              KEPK 2025
            </span>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-gray-900 font-mono">Disetujui</p>
          <p className="text-xs font-bold text-gray-700">{isEn ? "Ethical Approval" : "Persetujuan Etik"}</p>
          <p className="text-[11px] text-gray-500 leading-tight truncate" title="No. DP.04.03/D.XVI.2.3/1027/2025">
            No. DP.04.03/D.XVI.2.3/1027/2025
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CLINICAL CONTEXT & THE PROBLEM WE SOLVE */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-sm space-y-6">
        <div className="max-w-3xl space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {isEn
              ? "Bridging Clinical Dilemmas in Cirrhosis Pharmacotherapy"
              : "Mengatasi Dilema Klinis Farmakoterapi pada Sirosis Hati"}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {isEn
              ? "Liver cirrhosis is characterized by complex pharmacokinetic and pharmacodynamic alterations, including impaired hepatic clearance, altered plasma protein binding, portosystemic shunting, and heightened vulnerability to hepatorenal syndrome. In real-world inpatient wards, more than 60% of cirrhosis drug regimens are non-optimal or require vigilant dose adjustments to prevent severe adverse outcomes."
              : "Sirosis hati ditandai dengan perubahan farmakokinetik dan farmakodinamik yang sangat kompleks, seperti penurunan klirens metabolik hepar, penurunan ikatan protein plasma, pirau portosistemik, serta kerentanan tinggi terhadap komplikasi sindrom hepatorenal. Di bangsal rawat inap, lebih dari 60% peresepan obat pada pasien sirosis memerlukan penyesuaian dosis khusus untuk mencegah toksisitas fatal maupun perburukan dekompensasi hepar."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-100/70 text-red-900 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-gray-900 text-base">
              {isEn ? "High Mortality Uncertainty" : "Tingginya Ketidakpastian Mortalitas"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {isEn
                ? "Conventional scoring tools (such as CTP and MELD) often miss acute decompensating triggers like in-hospital sepsis and rapid renal impairment."
                : "Skor konvensional (seperti CTP dan MELD) sering kali tidak menangkap pemicu akut dekompensasi seperti sepsis rawat inap dan perburukan fungsi ginjal yang cepat."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-100/70 text-red-900 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-gray-900 text-base">
              {isEn ? "Complex Dose Adjustments" : "Kompleksitas Penyesuaian Dosis"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {isEn
                ? "Lack of consolidated dosing guidelines at the point of care leads to underdosing or overt toxicities in high-risk drugs (beta-blockers, diuretics, antibiotics, analgesics)."
                : "Ketiadaan panduan dosis terintegrasi di bedside rawat inap memicu underdosing atau toksisitas fatal pada obat-obatan berisiko tinggi (beta-blocker, diuretik, antibiotik, analgesik)."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-100/70 text-red-900 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-gray-900 text-base">
              {isEn ? "Need for Explainable AI" : "Kebutuhan AI yang Transparan"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {isEn
                ? "Clinicians cannot trust black-box algorithms. CirrhoSmart AI pairs Machine Learning with SHAP interpretability so clinicians understand each prediction."
                : "Klinisi tidak dapat memercayai algoritma black-box. CirrhoSmart AI memadukan Machine Learning dengan interpretabilitas SHAP agar klinisi memahami alasan di balik prediksi."}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE 3 CORE PILLARS OF CIRRHOSMART AI */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {isEn ? "Three Core Modules of CirrhoSmart AI" : "Tiga Modul Inti CirrhoSmart AI"}
          </h2>
          <p className="text-sm text-gray-600">
            {isEn
              ? "An interconnected suite of clinical tools built to support attending physicians and clinical pharmacists."
              : "Rangkaian instrumen klinis terpadu yang dirancang untuk mendukung Dokter Penanggung Jawab Pelayanan (DPJP) dan Apoteker Klinis."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Mortality */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-800 flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {isEn ? "AI Mortality Prediction" : "AI Prediksi Mortalitas"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {isEn
                  ? "Trained on 583 cohort patients using Random Forest (AUROC 0.8391). Evaluates sepsis, urea, sodium, hepatic encephalopathy, INR, SGOT, GFR, and Child-Pugh class with real-time SHAP feature contribution analysis."
                  : "Dilatih pada 583 kohort pasien menggunakan Random Forest (AUROC 0.8391). Mengevaluasi sepsis, ureum, natrium, ensefalopati hepatikum, INR, SGOT, GFR, dan kelas CTP dengan analisis kontribusi faktor klinis SHAP secara real-time."}
              </p>
              <ul className="space-y-1.5 text-xs text-gray-700 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isEn ? "High sensitivity (83.33%) & NPV (97.47%)" : "Sensitivitas tinggi (83.33%) & NPV (97.47%)"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isEn ? "Transparent SHAP feature contributions" : "Transparansi kontribusi fitur SHAP per pasien"}</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handleGoToCalculator}
              className="mt-6 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-50 hover:bg-red-900 text-red-900 hover:text-white text-xs font-bold transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <span>{isEn ? "Launch Mortality Predictor" : "Buka Modul Mortalitas"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 2: LoS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-800 flex items-center justify-center">
                <Hospital className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {isEn ? "AI Length of Stay (LoS)" : "AI Prediksi Lama Rawat"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {isEn
                  ? "Assesses prolonged inpatient stay risks (>7 days median) using 9 multidimensional parameters including dynamic UNOS MELD score, helping optimize bed management and early discharge planning."
                  : "Mengidentifikasi risiko lama rawat berkepanjangan (>7 hari median) menggunakan 9 parameter multidimensi termasuk skor UNOS MELD dinamis untuk mengoptimalkan manajemen bed dan discharge planning terencana."}
              </p>
              <ul className="space-y-1.5 text-xs text-gray-700 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isEn ? "Dynamic UNOS MELD integration" : "Integrasi otomatis skor UNOS MELD"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isEn ? "Inpatient bed utilization planning" : "Optimalisasi utilisasi bed rawat inap"}</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handleGoToCalculator}
              className="mt-6 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-50 hover:bg-red-900 text-red-900 hover:text-white text-xs font-bold transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <span>{isEn ? "Launch LoS Predictor" : "Buka Modul Lama Rawat"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 3: Dose Recommendation */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-800 flex items-center justify-center">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {isEn ? "Clinical Dose Engine" : "Rekomendasi Dosis Klinis"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {isEn
                  ? "Rule-based expert decision engine covering 19 cirrhosis-essential medications (beta-blockers, diuretics, antibiotics, PPIs, analgesics) based on AASLD, EASL, PPHI, and FDA guidelines with 84.2% concordance."
                  : "Rule-based expert engine yang mencakup 19 obat esensial sirosis hati (beta-blocker, diuretik, antibiotik, PPI, analgesik) berdasarkan konsensus AASLD, EASL, PPHI, dan FDA dengan konkordansi klinis 84.2%."}
              </p>
              <ul className="space-y-1.5 text-xs text-gray-700 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isEn ? "AASLD, EASL & PPHI Guideline Concordance" : "Berlandaskan pedoman AASLD, EASL & PPHI"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isEn ? "Renal (eGFR) & Hepatic (CTP) Stratified" : "Penyesuaian terstratifikasi renal & hepatik"}</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handleGoToCalculator}
              className="mt-6 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-50 hover:bg-red-900 text-red-900 hover:text-white text-xs font-bold transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <span>{isEn ? "Launch Dose Recommender" : "Buka Modul Rekomendasi Dosis"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. STEP-BY-STEP CLINICAL WORKFLOW */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-sm space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {isEn ? "How CirrhoSmart AI Operates in Inpatient Care" : "Alur Operasional di Bangsal Rawat Inap"}
          </h2>
          <p className="text-sm text-gray-600">
            {isEn
              ? "Designed for seamless integration into medical rounds and clinical pharmacy medication reviews."
              : "Dirancang untuk integrasi cepat dalam visite medis dokter DPJP maupun telaah resep apoteker klinis."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-900 text-white flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h4 className="font-bold text-gray-900 text-base">
              {isEn ? "Clinical Input" : "Input Parameter Pasien"}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {isEn
                ? "Enter laboratory tests (INR, Bilirubin, Albumin, Urea, Sodium, Creatinine) or use auto-calculators for CTP and CKD-EPI 2021 GFR."
                : "Masukkan data lab (INR, Bilirubin, Albumin, Ureum, Natrium, Kreatinin) atau gunakan kalkulator otomatis untuk skor CTP & GFR."}
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-900 text-white flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h4 className="font-bold text-gray-900 text-base">
              {isEn ? "Machine Learning Inference" : "Inferensi Machine Learning"}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {isEn
                ? "Trained algorithms compute probabilistic mortality and LoS risks, highlighting predominant risk factors via SHAP explanations."
                : "Algoritma menghitung probabilitas risiko mortalitas dan lama rawat, serta menampilkan kontributor risiko dominan melalui SHAP."}
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-900 text-white flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h4 className="font-bold text-gray-900 text-base">
              {isEn ? "Rule Engine Evaluation" : "Evaluasi Rule Engine"}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {isEn
                ? "The system checks drug indications against CTP class, eGFR, MAP, and acute complications to deliver personalized dose bounds."
                : "Sistem mencocokkan indikasi obat dengan kelas CTP, eGFR, tekanan darah MAP, dan komplikasi untuk rekomendasi rentang dosis aman."}
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h4 className="font-bold text-gray-900 text-base">
              {isEn ? "Professional Adjudication" : "Adjudikasi Profesional"}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {isEn
                ? "The attending physician (DPJP) and clinical pharmacist review AI insights and make the final, informed clinical decision."
                : "Dokter DPJP dan Apoteker Klinis memvalidasi rekomendasi dan menetapkan keputusan tatalaksana akhir yang paling aman bagi pasien."}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. RESEARCH TEAM & PROMOTORS */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {isEn ? "Research Team & Clinical Advisors" : "Tim Peneliti & Dewan Promotor"}
          </h2>
          <p className="text-sm text-gray-600">
            {isEn
              ? "Multidisciplinary collaboration across Clinical Pharmacy, Hepatology, Pharmacology, and Artificial Intelligence."
              : "Kolaborasi multidisiplin antara Farmasi Klinis, Hepatologi, Farmakologi, dan Kecerdasan Buatan."}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
            {/* Lead Researcher: apt. Serdiani */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-red-100 shadow-md mb-5 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/images/serdiani.jpeg"
                  alt="apt. Serdiani, S.Si, M.Farm"
                  className="w-full h-full object-cover scale-125"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://ui-avatars.com/api/?name=Serdiani&background=fee2e2&color=991b1b&size=200";
                  }}
                />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-1">
                apt. Serdiani, S.Si, M.Farm
              </h3>
              <p className="text-red-900 font-bold text-xs uppercase tracking-wider mb-1">
                {isEn ? "Lead Researcher • Doctoral Candidate" : "Peneliti Utama • Kandidat Doktor"}
              </p>
              <p className="text-gray-500 font-medium text-xs mb-4">
                {isEn ? "Faculty of Pharmacy, Universitas Andalas" : "Fakultas Farmasi, Universitas Andalas"}
              </p>
              <a
                href="mailto:serdiani.farmasi1@gmail.com?subject=Pertanyaan Riset: CirrhoSmart AI"
                className="mt-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 hover:bg-red-900 text-red-900 hover:text-white border border-red-200 text-xs font-bold transition-all duration-300"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{isEn ? "Contact Researcher" : "Email Peneliti"}</span>
              </a>
            </div>

            {/* Promotors */}
            {promotors.map((p) => (
              <div key={p.id} className="flex flex-col items-center text-center group">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-100 shadow-md mb-5 transition-transform duration-300 group-hover:scale-105 group-hover:border-red-100">
                  <img
                    src={`/images/promotor-${p.id}.jpeg`}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=Promotor+${p.id}&background=f87171&color=ffffff&size=200`;
                    }}
                  />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-1 leading-snug">
                  {p.name}
                </h3>
                <p className="text-red-900 font-bold text-xs uppercase tracking-wider mb-1">
                  {p.role}
                </p>
                <p className="text-gray-500 font-medium text-xs">
                  {p.institution}
                </p>
              </div>
            ))}

            {/* AI Engineer: Yavie Azka */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-red-100 shadow-md mb-5 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/images/yavie.jpg"
                  alt="Yavie Azka Putra Araly"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://ui-avatars.com/api/?name=Yavie+Azka&background=fee2e2&color=991b1b&size=200";
                  }}
                />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-1">
                Yavie Azka Putra Araly
              </h3>
              <p className="text-red-900 font-bold text-xs uppercase tracking-wider mb-1">
                AI & Software Engineer
              </p>
              <p className="text-gray-500 font-medium text-xs mb-4">
                {isEn ? "Informatics, Institut Teknologi Bandung" : "Teknik Informatika, Institut Teknologi Bandung"}
              </p>
              <a
                href="mailto:yavieazkaputra@gmail.com?subject=Pertanyaan Teknis: CirrhoSmart AI"
                className="mt-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 hover:bg-red-900 text-red-900 hover:text-white border border-red-200 text-xs font-bold transition-all duration-300"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{isEn ? "Contact Engineer" : "Email Pengembang"}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. BOTTOM CALL TO ACTION: READY TO USE CALCULATOR */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-r from-red-950 via-red-900 to-rose-950 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl border border-red-800 space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isEn
              ? "Ready to Perform Patient Evaluation?"
              : "Siap Melakukan Evaluasi Klinis Pasien?"}
          </h3>
          <p className="text-sm sm:text-base text-red-100/90 leading-relaxed">
            {isEn
              ? "Access the interactive clinical calculator to assess in-hospital mortality, length of stay, and personalized drug dosing adjustments."
              : "Akses kalkulator klinis interaktif untuk mengkalkulasi probabilitas mortalitas, lama rawat, dan rekomendasi penyesuaian dosis obat."}
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={handleGoToCalculator}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-red-950 hover:bg-red-50 hover:text-red-900 text-base sm:text-lg font-black transition-all duration-300 shadow-2xl active:scale-95 group cursor-pointer"
          >
            <HeartPulse className="w-6 h-6 text-red-700 transition-transform group-hover:scale-125" />
            <span>{isEn ? "Launch Clinical Calculator Now" : "Buka Kalkulator Klinis Sekarang"}</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
