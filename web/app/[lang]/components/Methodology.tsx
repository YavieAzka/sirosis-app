// File: app/[lang]/components/Methodology.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Award,
  FileText,
  CheckCircle2,
  Layers,
  Search,
  ExternalLink,
  Filter,
  TrendingUp,
  Activity,
  Database,
  ShieldAlert,
  Microscope,
  ArrowRight,
  Hospital,
  Pill,
  Sparkles,
  Stethoscope,
  Info,
  ChevronRight,
} from "lucide-react";
import {
  COHORT_CHARACTERISTICS,
  MODEL_METRICS_TABLE,
  DOSE_APPROPRIATENESS_DATA,
  CONCORDANCE_CASES,
  SCIENTIFIC_REFERENCES,
  ClinicalReference,
} from "./methodologyData";

interface MethodologyProps {
  dict: any;
  lang?: string;
}

type TabType =
  | "overview"
  | "cohort"
  | "hybrid_ai"
  | "metrics"
  | "shap"
  | "dosing"
  | "references";

export default function Methodology({ dict, lang = "id" }: MethodologyProps) {
  const isEn = lang === "en";
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // State untuk pencarian dan filter referensi
  const [refSearch, setRefSearch] = useState("");
  const [refCategory, setRefCategory] = useState<string>("all");

  const filteredReferences = useMemo(() => {
    return SCIENTIFIC_REFERENCES.filter((ref) => {
      const matchCategory =
        refCategory === "all" || ref.category === refCategory;
      const q = refSearch.toLowerCase().trim();
      if (!q) return matchCategory;

      const matchText =
        ref.title.toLowerCase().includes(q) ||
        ref.authors.toLowerCase().includes(q) ||
        ref.journal.toLowerCase().includes(q) ||
        ref.year.toString().includes(q) ||
        (ref.doi && ref.doi.toLowerCase().includes(q));

      return matchCategory && matchText;
    });
  }, [refSearch, refCategory]);

  const tabs = [
    {
      id: "overview" as TabType,
      label: dict?.methodology?.tabs?.overview || (isEn ? "Overview & Pipeline" : "Ringkasan & Alur Riset"),
      icon: Activity,
    },
    {
      id: "cohort" as TabType,
      label: dict?.methodology?.tabs?.cohort || (isEn ? "Cohort Characteristics" : "Karakteristik Kohort"),
      icon: Hospital,
    },
    {
      id: "hybrid_ai" as TabType,
      label: dict?.methodology?.tabs?.hybrid_ai || (isEn ? "Hybrid AI Architecture" : "Arsitektur Hybrid AI"),
      icon: Layers,
    },
    {
      id: "metrics" as TabType,
      label: dict?.methodology?.tabs?.metrics || (isEn ? "Model Performance" : "Komparasi Model (Tabel 3)"),
      icon: TrendingUp,
    },
    {
      id: "shap" as TabType,
      label: dict?.methodology?.tabs?.shap || (isEn ? "Explainable AI (SHAP)" : "Transparansi AI (SHAP)"),
      icon: Microscope,
    },
    {
      id: "dosing" as TabType,
      label: dict?.methodology?.tabs?.dosing || (isEn ? "Dose Evaluation" : "Evaluasi Dosis & Validasi"),
      icon: Pill,
    },
    {
      id: "references" as TabType,
      label: dict?.methodology?.tabs?.references || (isEn ? "Guidelines & References" : "Pedoman & Referensi"),
      icon: BookOpen,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-fade-in font-sans text-gray-800">
      {/* ========================================================= */}
      {/* 1. HERO HEADER WITH BADGES */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-800 p-8 sm:p-12 text-white relative">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-red-100 uppercase tracking-wider mb-4 backdrop-blur-sm">
            <Award className="w-4 h-4 text-red-200" />
            {isEn ? "Doctoral Dissertation Research Manuscript" : "Naskah Riset Disertasi Doktoral"}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-sm mb-4 leading-tight">
            {dict?.methodology?.title ||
              (isEn
                ? "Research Methodology & AI Framework"
                : "Metodologi Riset & Kerangka AI")}
          </h1>

          <p className="text-red-100 text-sm sm:text-base max-w-4xl leading-relaxed">
            {dict?.methodology?.subtitle ||
              (isEn
                ? "Development and internal validation of an Explainable Artificial Intelligence (XAI) model for personalized drug dose recommendations and outcome prediction in hospitalized patients with liver cirrhosis at Dr. M. Djamil General Hospital, Padang."
                : "Pengembangan dan validasi internal model Explainable Artificial Intelligence (XAI) untuk rekomendasi dosis obat terpersonalisasi dan stratifikasi prognosis klinis pada pasien sirosis hati rawat inap di RSUP Dr. M. Djamil Padang.")}
          </p>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
              <span className="text-xs text-red-200 block font-medium">
                {isEn ? "Patient Cohort" : "Kohort Pasien"}
              </span>
              <span className="text-base sm:text-lg font-extrabold text-white block mt-0.5 font-mono tabular-nums">
                583 {isEn ? "Inpatients" : "Pasien"}
              </span>
              <span className="text-[11px] text-red-200/80">RSUP Dr. M. Djamil</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
              <span className="text-xs text-red-200 block font-medium">
                {isEn ? "Ethics Approval" : "Persetujuan Etik"}
              </span>
              <span className="text-base sm:text-lg font-extrabold text-white block mt-0.5 font-mono tabular-nums">
                KEPK No. 1027
              </span>
              <span className="text-[11px] text-red-200/80">22 Juli 2025</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
              <span className="text-xs text-red-200 block font-medium">
                {isEn ? "Mortality AUROC (RF)" : "AUROC Mortalitas (RF)"}
              </span>
              <span className="text-base sm:text-lg font-extrabold text-emerald-300 block mt-0.5 font-mono tabular-nums">
                0.8391
              </span>
              <span className="text-[11px] text-red-200/80 font-mono tabular-nums">95% CI: 0.791–0.885</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
              <span className="text-xs text-red-200 block font-medium">
                {isEn ? "Dose Concordance" : "Konkordansi Dosis"}
              </span>
              <span className="text-base sm:text-lg font-extrabold text-amber-300 block mt-0.5 font-mono tabular-nums">
                84.2%
              </span>
              <span className="text-[11px] text-red-200/80 font-mono tabular-nums">
                16/19 {isEn ? "Case evaluations" : "Evaluasi klinis"}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. TABBED NAVIGATION */}
        {/* ========================================================= */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-8 py-3 overflow-x-auto scrollbar-none flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-red-900 text-white shadow-md shadow-red-900/20"
                    : "bg-white text-gray-600 hover:text-red-900 hover:bg-red-50/60 border border-gray-200"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* 3. TAB CONTENT PANELS */}
        {/* ========================================================= */}
        <div className="p-6 sm:p-10">
          {/* ------------------------------------------------------- */}
          {/* TAB 1: OVERVIEW & PIPELINE */}
          {/* ------------------------------------------------------- */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {isEn ? "Research Summary & AI Development Pipeline" : "Ringkasan Riset & Alur Pengembangan AI"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {isEn
                    ? "Overview of the research rationale, objectives, ethical compliance, and the systematic AI workflow."
                    : "Latar belakang, tujuan klinis, persetujuan etik, serta tahapan sistematis rekayasa kecerdasan buatan."}
                </p>
              </div>

              {/* Research Narrative */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                  <div className="flex items-center gap-2.5 text-red-900 font-bold text-base mb-3">
                    <Hospital className="w-5 h-5 text-red-800" />
                    {isEn ? "Clinical Urgency & Challenge" : "Urgensi & Tantangan Klinis"}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {isEn
                      ? "Liver cirrhosis alters drug pharmacokinetics and pharmacodynamics through reduced metabolic capacity, portosystemic shunting, impaired protein binding, and concomitant renal dysfunctions (e.g., AKI, CKD, and hepatorenal syndrome). In hospitalized patients, dosing errors frequently lead to drug-induced toxicity or therapeutic failure. International guidelines often provide general recommendations rather than patient-tailored decisions."
                      : "Sirosis hati mengubah farmakokinetika dan farmakodinamika obat secara drastis melalui penurunan metabolisme hepatik, pirau portosistemik, hipoalbuminemia, serta disfungsi renal penyerta (AKI, CKD, dan sindrom hepatorenal). Pada pasien rawat inap, deviasi dosis berisiko memicu toksisitas atau kegagalan terapi. Pedoman internasional saat ini masih didominasi panduan umum yang belum terpersonalisasi."}
                  </p>
                </div>

                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-base mb-3">
                    <Sparkles className="w-5 h-5 text-emerald-800" />
                    {isEn ? "The CirrhoSmart AI Solution" : "Solusi CirrhoSmart AI"}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {isEn
                      ? "CirrhoSmart combines data-driven Machine Learning (Random Forest & XGBoost) for quantitative risk stratification (mortality & length of stay) with a deterministic Logic-Driven Expert System for medication dosing. Integrated SHAP explainability provides full transparency for hospital pharmacists and hepatologists, moving beyond opaque black-box algorithms."
                      : "CirrhoSmart memadukan Machine Learning berbasis data (Random Forest & XGBoost) untuk stratifikasi risiko mortalitas dan lama rawat inap dengan Expert System deterministik berbasis logika klinis untuk penyesuaian dosis obat. Transparansi melalui metode SHAP memastikan setiap rekomendasi dapat dipahami dan diaudit oleh apoteker dan dokter spesialis."}
                  </p>
                </div>
              </div>

              {/* Development Pipeline Workflow Diagram */}
              <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-800" />
                  {isEn ? "AI Development Workflow (Figure 1 in Manuscript)" : "Alur Pengembangan Model AI (Gambar 1 Manuskrip)"}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-6">
                  {isEn
                    ? "From retrospective EHR extraction at Dr. M. Djamil Hospital to internal cross-validation and clinical decision deployment."
                    : "Tahapan dari ekstraksi rekam medis elektronik di RSUP Dr. M. Djamil hingga validasi silang internal dan implementasi CDSS."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                  {/* Step 1 */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-900 font-bold flex items-center justify-center text-sm mb-3">
                      1
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      {isEn ? "Cohort Extraction" : "Ekstraksi Kohort"}
                    </h4>
                    <p className="text-xs text-gray-600 leading-normal">
                      {isEn
                        ? "583 adult patients with confirmed cirrhosis (ICD-10 K74.6) across 137 clinical & laboratory variables."
                        : "583 pasien dewasa terkonfirmasi sirosis (ICD-10 K74.6) meliputi 137 variabel klinis dan laboratorium."}
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-900 font-bold flex items-center justify-center text-sm mb-3">
                      2
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      {isEn ? "MICE Imputation" : "Imputasi MICE & Scaling"}
                    </h4>
                    <p className="text-xs text-gray-600 leading-normal">
                      {isEn
                        ? "Multiple Imputation by Chained Equations (RF MICE) for missing data, outlier correction, and dynamic MELD calculation."
                        : "Multiple Imputation by Chained Equations (RF MICE), koreksi outlier, standardisasi fitur, dan kalkulasi MELD dinamis."}
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-900 font-bold flex items-center justify-center text-sm mb-3">
                      3
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      {isEn ? "Dual Model Training" : "Pelatihan Model Paralel"}
                    </h4>
                    <p className="text-xs text-gray-600 leading-normal">
                      {isEn
                        ? "Random Forest & XGBoost trained on Mortality (n=395) and LOS (n=583) using Repeated Stratified 5-Fold CV."
                        : "Pelatihan Random Forest & XGBoost untuk Mortalitas (n=395) dan LoS (n=583) dengan Repeated Stratified 5-Fold CV."}
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-900 font-bold flex items-center justify-center text-sm mb-3">
                      4
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      {isEn ? "XAI & Rule Engine" : "XAI & Decision Support"}
                    </h4>
                    <p className="text-xs text-gray-600 leading-normal">
                      {isEn
                        ? "SHAP TreeExplainer feature decomposition paired with deterministic clinical rules for 8 drug classes."
                        : "Dekomposisi SHAP TreeExplainer dipasangkan dengan rule engine deterministik 8 obat berstandar AASLD/EASL/KDIGO."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ethical Statement Notice */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3 text-blue-900">
                <Info className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold block mb-0.5">
                    {isEn ? "Research Ethics Statement" : "Pernyataan Etik Penelitian"}
                  </span>
                  {isEn
                    ? "This study was approved by the Health Research Ethics Committee of Dr. M. Djamil General Hospital, Padang, Indonesia on 22 July 2025 (Reference Number: DP.04.03/D.XVI.2.3/1027/2025). All patient data was fully de-identified and handled in accordance with the Declaration of Helsinki."
                    : "Penelitian ini telah memperoleh persetujuan etik dari Komisi Etik Penelitian Kesehatan (KEPK) RSUP Dr. M. Djamil Padang, Indonesia pada tanggal 22 Juli 2025 (Nomor Registrasi: DP.04.03/D.XVI.2.3/1027/2025). Seluruh data pasien telah di-anonimkan demi menjaga privasi dan mematuhi Deklarasi Helsinki."}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 2: COHORT CHARACTERISTICS (TABLE 1) */}
          {/* ------------------------------------------------------- */}
          {activeTab === "cohort" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {isEn ? "Baseline Cohort Characteristics (Table 1)" : "Karakteristik Baseline Pasien Kohort (Tabel 1 Manuskrip)"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {isEn
                    ? "Distribution of demographic, hepatic severity, and clinical complications among 583 hospitalized cirrhosis patients."
                    : "Distribusi parameter demografi, tingkat keparahan Child-Pugh, komplikasi dekompensasi, dan komorbiditas dari 583 pasien."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {COHORT_CHARACTERISTICS.map((cat, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                  >
                    <div className="bg-gray-50/80 px-5 py-3.5 border-b border-gray-200">
                      <h3 className="font-bold text-sm text-red-950 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-800" />
                        {isEn ? cat.categoryEn : cat.categoryId}
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {cat.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="px-5 py-3 flex justify-between items-center text-xs sm:text-sm hover:bg-gray-50/50 transition-colors"
                        >
                          <span className="text-gray-700 font-medium max-w-[60%]">
                            {isEn ? item.labelEn : item.labelId}
                          </span>
                          <span className="font-extrabold text-gray-900 text-right font-mono tabular-nums">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs sm:text-sm text-amber-900">
                <span className="font-bold block mb-1">
                  {isEn ? "Key Clinical Observation from Cohort:" : "Observasi Kunci dari Kohort:"}
                </span>
                {isEn
                  ? "Child-Turcotte-Pugh Class B (56.1%) and Class C (31.4%) constituted the overwhelming majority (87.5%), demonstrating high hepatic dysfunction severity. Frequent portal hypertension complications (esophageal varices 36.6%, ascites 33.3%, HE 19.4%) and extrahepatic comorbidities (pneumonia 21.5%, CKD 17.4%) underline the absolute necessity for multi-factorial dosage individualization."
                  : "Pasien dengan derajat Child-Turcotte-Pugh Kelas B (56.1%) dan Kelas C (31.4%) mencakup mayoritas absolut (87.5%), mengindikasikan dominasi disfungsi hati derajat sedang hingga berat. Tingginya frekuensi komplikasi hipertensi portal (varises 36.6%, asites 33.3%, ensefalopati 19.4%) serta komorbiditas ekstrahepatik (pneumonia 21.5%, CKD 17.4%) menegaskan bahwa dosis obat tidak dapat hanya mengandalkan fungsi hati semata."}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 3: HYBRID AI ARCHITECTURE & PREPROCESSING */}
          {/* ------------------------------------------------------- */}
          {activeTab === "hybrid_ai" && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {isEn ? "Hybrid Artificial Intelligence Architecture" : "Arsitektur Hybrid AI & Rekayasa Data"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {isEn
                    ? "Synergistic integration of probabilistic Machine Learning and deterministic clinical rule reasoning."
                    : "Integrasi sinergis antara Machine Learning probabilistik dan penalaran aturan klinis deterministik."}
                </p>
              </div>

              {/* Dual Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border-2 border-red-800 shadow-sm relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-red-100 text-red-900 rounded-xl">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-red-800 uppercase tracking-wider block">
                        {isEn ? "Engine 1: Data-Driven" : "Pilar 1: Berbasis Data"}
                      </span>
                      <h3 className="text-lg font-extrabold text-gray-900">
                        Machine Learning (Random Forest & XGBoost)
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
                    {isEn
                      ? "Responsible for quantitative risk projection. Evaluates multidimensional baseline variables to output calibrated probabilities for in-hospital mortality and prolonged hospitalization (LOS > 7 days)."
                      : "Bertanggung jawab untuk proyeksi risiko kuantitatif. Memproses variabel multidimensi untuk menghasilkan probabilitas terkalibrasi mengenai risiko mortalitas rumah sakit dan durasi rawat inap memanjang (> 7 hari)."}
                  </p>
                  <ul className="text-xs text-gray-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-800 shrink-0" />
                      <span>{isEn ? "Trained with Repeated Stratified 5-Fold CV" : "Dilatih dengan Repeated Stratified 5-Fold CV"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-800 shrink-0" />
                      <span>{isEn ? "Class imbalance mitigation (class_weight='balanced')" : "Penanganan ketidakseimbangan kelas (class_weight='balanced')"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-800 shrink-0" />
                      <span>{isEn ? "Integrated TreeExplainer for SHAP decomposition" : "Terintegrasi TreeExplainer untuk dekomposisi SHAP"}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl border-2 border-emerald-700 shadow-sm relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                        {isEn ? "Engine 2: Logic-Driven" : "Pilar 2: Berbasis Aturan Klinis"}
                      </span>
                      <h3 className="text-lg font-extrabold text-gray-900">
                        {isEn ? "Deterministic Expert System" : "Sistem Pakar Deterministik"}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
                    {isEn
                      ? "A rigorous decision engine translating global clinical guidelines (AASLD, EASL, KDIGO, FDA) into individualized dose adjustments. Eliminates hallucination risks inherent to pure generative models in pharmacotherapy."
                      : "Decision engine deterministik yang menerjemahkan pedoman konsensus global (AASLD, EASL, KDIGO, FDA) menjadi penyesuaian dosis obat yang presisi. Meniadakan risiko halusinasi AI generatif dalam penanganan obat hepatotoksik."}
                  </p>
                  <ul className="text-xs text-gray-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{isEn ? "Multi-axis triage: CTP (A/B/C), eGFR, MAP, and body weight" : "Triase multi-aksis: Derajat CTP, eGFR, MAP, dan berat badan"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{isEn ? "Safety Red Flag overrides for AKI, Sepsis, and HRS" : "Protokol Override Kondisi Kritis (AKI, Sepsis, HRS, AST/ALT)"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{isEn ? "84.2% agreement with specialist clinical adjudication" : "Tervalidasi konkordan 84.2% dengan adjudikasi pakar"}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Data Preprocessing Deep Dive */}
              <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-red-900" />
                  {isEn ? "Advanced Data Preprocessing & Feature Engineering" : "Pemrosesan Data & Rekayasa Fitur (ML Engineering)"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-sm text-gray-900 mb-1">MICE Imputation</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {isEn
                        ? "Handled missing values using Multiple Imputation by Chained Equations with Random Forest regressors, avoiding simplistic mean imputation to preserve biological non-linearities."
                        : "Penanganan missing values menggunakan Multiple Imputation by Chained Equations berbasis Random Forest, menjaga relasi biologis non-linear dibanding rata-rata sederhana."}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-sm text-gray-900 mb-1">UNOS MELD Score</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {isEn
                        ? "Calculated dynamically: 3.78*ln(bil) + 11.2*ln(INR) + 9.57*ln(Cr) + 6.43, with baseline floor at 1.0 and creatinine capped at 4.0 mg/dL according to UNOS standards."
                        : "Dihitung dinamis: 3.78*ln(bil) + 11.2*ln(INR) + 9.57*ln(Cr) + 6.43, dengan nilai batas minimum 1.0 dan kreatinin di-cap 4.0 mg/dL sesuai standar UNOS."}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-sm text-gray-900 mb-1">StandardScaler & OHE</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {isEn
                        ? "Continuous lab parameters were normalized using StandardScaler, and categorical indices were transformed via One-Hot Encoding within cross-validation folds to prevent data leakage."
                        : "Parameter laboratorium kontinu dinormalisasi dengan StandardScaler, dan variabel kategori ditransformasi melalui One-Hot Encoding di dalam lipatan cross-validation."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 4: MODEL PERFORMANCE METRICS (TABLE 3) */}
          {/* ------------------------------------------------------- */}
          {activeTab === "metrics" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {isEn ? "Model Performance Comparison (Table 3)" : "Komparasi Kinerja Model AI (Tabel 3 Manuskrip)"}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {isEn
                      ? "Internal 5-fold cross-validation results comparing Random Forest vs. XGBoost across mortality and length of stay."
                      : "Hasil evaluasi 5-fold cross-validation membandingkan Random Forest dan XGBoost pada prediksi mortalitas dan lama rawat."}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-lg shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                  {isEn ? "Primary Production Model: Random Forest" : "Model Terpilih: Random Forest"}
                </div>
              </div>

              {/* Table 3 Rendering */}
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-red-950 text-white border-b border-red-900">
                      <th className="py-3.5 px-4 font-bold">{isEn ? "Evaluated Metric" : "Metrik Evaluasi"}</th>
                      <th className="py-3.5 px-4 font-bold text-center bg-red-900">
                        {isEn ? "Mortality - RF (Primary)" : "Mortalitas - RF (Utama)"}
                      </th>
                      <th className="py-3.5 px-4 font-bold text-center">
                        {isEn ? "Mortality - XGBoost" : "Mortalitas - XGBoost"}
                      </th>
                      <th className="py-3.5 px-4 font-bold text-center bg-gray-900">
                        {isEn ? "LOS - RF (Primary)" : "LoS - RF (Utama)"}
                      </th>
                      <th className="py-3.5 px-4 font-bold text-center text-gray-300">
                        {isEn ? "LOS - XGBoost" : "LoS - XGBoost"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {MODEL_METRICS_TABLE.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          row.highlight
                            ? "bg-amber-50/60 font-semibold"
                            : idx % 2 === 0
                            ? "bg-white"
                            : "bg-gray-50/60"
                        } hover:bg-red-50/40`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">
                            {isEn ? row.labelEn : row.labelId}
                          </div>
                          <div className="text-[11px] text-gray-500 font-normal">
                            {isEn ? row.descriptionEn : row.descriptionId}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-extrabold text-red-900 bg-red-50/40 font-mono tabular-nums">
                          {row.mortalityRf}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-800 font-mono tabular-nums">
                          {row.mortalityXgb}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-gray-900 bg-gray-100/50 font-mono tabular-nums">
                          {row.losRf}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-700 font-mono tabular-nums">
                          {row.losXgb}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Discussion Note from Manuscript Section 4.3 */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <span className="font-bold text-gray-900 block mb-2">
                  {isEn ? "Scientific Interpretation of Results:" : "Interpretasi Ilmiah Hasil Evaluasi:"}
                </span>
                <p className="mb-2">
                  {isEn
                    ? "1. Mortality Prediction: Both models demonstrated strong discrimination (RF AUROC 0.8391; XGBoost 0.8371), proving that baseline clinical indicators and acute complications reliably stratify in-hospital mortality risk in advanced cirrhosis."
                    : "1. Prediksi Mortalitas: Kedua model menunjukkan diskriminasi yang kuat (RF AUROC 0.8391; XGBoost 0.8371), membuktikan bahwa kombinasi komplikasi akut dan indikator laboratorium baseline mampu membedakan risiko kematian secara akurat."}
                </p>
                <p>
                  {isEn
                    ? "2. Length of Stay (LOS) Prediction: Discrimination was modest (RF AUROC 0.5664; XGBoost 0.5005). As analyzed in the manuscript, hospitalization duration is highly dynamic, influenced by non-clinical logistics and 'survival bias' (where critically ill patients with extreme bilirubin died early, inadvertently removing them from the prolonged stay cohort). Random Forest was selected for production because of superior AUROC and MCC."
                    : "2. Prediksi Lama Rawat (LoS): Diskriminasi berada pada tingkat moderat (RF AUROC 0.5664; XGBoost 0.5005). Hal ini disebabkan oleh sifat durasi rawat yang sangat dinamis, faktor logistik klinis, serta fenomena 'survival bias' (pasien kritis dengan bilirubin sangat tinggi meninggal lebih awal, sehingga tidak tercatat dalam kelompok rawat inap memanjang)."}
                </p>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 5: EXPLAINABLE AI & SHAP */}
          {/* ------------------------------------------------------- */}
          {activeTab === "shap" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {isEn ? "Explainable Artificial Intelligence (SHAP Framework)" : "Transparansi Keputusan Klinis (Framework SHAP)"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {isEn
                    ? "Deconstructing model predictions into individualized feature contributions using SHapley Additive exPlanations."
                    : "Mendekonstruksi prediksi model menjadi kontribusi variabel individual menggunakan SHapley Additive exPlanations."}
                </p>
              </div>

              {/* Feature Ranking Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="font-extrabold text-base text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                    {isEn ? "Mortality Model SHAP Ranking (Figure 4A & 5A)" : "Peringkat Prediktor Mortalitas (Gambar 4A & 5A)"}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    {isEn ? "Features ranked by mean absolute SHAP value (|SHAP|):" : "Variabel diurutkan berdasarkan kontribusi mutlak |SHAP|:"}
                  </p>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="p-3 bg-red-50/60 rounded-xl border border-red-100">
                      <span className="font-bold text-red-950 block">1. Sepsis & Ensefalopati Hepatikum (HE)</span>
                      <span className="text-gray-600 text-xs">
                        {isEn
                          ? "Strongest binary drivers; presence of either dramatically increases predicted death probability."
                          : "Pendorong risiko biner terkuat; kehadiran salah satunya langsung mendongkrak probabilitas kematian."}
                      </span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="font-bold text-gray-900 block">2. Urea Baseline, INR, & SGOT/AST</span>
                      <span className="text-gray-600 text-xs">
                        {isEn
                          ? "Higher values correlate monotonically with elevated mortality risk (coagulopathy & hepatic necrosis)."
                          : "Kadar tinggi berkorelasi positif dengan risiko kematian (tanda koagulopati dan nekrosis hepatoseluler)."}
                      </span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="font-bold text-gray-900 block">3. Natrium Rendah & GFR Menurun</span>
                      <span className="text-gray-600 text-xs">
                        {isEn
                          ? "Severe hyponatremia (<130 mmol/L) and renal failure (eGFR <30) drive hepatorenal syndrome risk."
                          : "Hiponatremia berat dan penurunan filtrasi ginjal menjadi indikator kuat sindrom hepatorenal."}
                      </span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="font-bold text-gray-900 block">4. Kelas Child-Turcotte-Pugh (CTP)</span>
                      <span className="text-gray-600 text-xs">
                        {isEn ? "Monotonic risk gradient: Class C > Class B > Class A." : "Gradien risiko konsisten: CTP C > CTP B > CTP A."}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="font-extrabold text-base text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    {isEn ? "Length of Stay SHAP Ranking (Figure 4B & 5B)" : "Peringkat Prediktor Lama Rawat (Gambar 4B & 5B)"}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    {isEn ? "Features ranked by mean absolute SHAP value (|SHAP|):" : "Variabel diurutkan berdasarkan kontribusi mutlak |SHAP|:"}
                  </p>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                      <span className="font-bold text-blue-950 block">1. Total Bilirubin Baseline (|SHAP| = 0.0436)</span>
                      <span className="text-gray-600 text-xs">
                        {isEn
                          ? "Inverse relationship: low bilirubin associated with longer hospital stay due to survival bias (early deaths censored)."
                          : "Hubungan terbalik: bilirubin rendah berkontribusi positif terhadap lama rawat akibat survival bias pasien kritis."}
                      </span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="font-bold text-gray-900 block">2. eGFR (|SHAP| = 0.0246) & AST (|SHAP| = 0.0218)</span>
                      <span className="text-gray-600 text-xs">
                        {isEn
                          ? "Renal impairment and acute hepatic flares prolonged inpatient stabilization duration."
                          : "Penurunan fungsi ginjal dan peradangan hati aktif memperpanjang durasi stabilisasi bangsal."}
                      </span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="font-bold text-gray-900 block">3. Skor MELD, Usia, & Kreatinin Baseline</span>
                      <span className="text-gray-600 text-xs">
                        {isEn
                          ? "Moderate contributors reflecting systemic physiological stress and physiological reserves."
                          : "Kontributor moderat yang mencerminkan beban fisiologis sistemik dan cadangan kompensasi pasien."}
                      </span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="font-bold text-gray-900 block">4. Sepsis & CTP Class (|SHAP| &lt; 0.003)</span>
                      <span className="text-gray-600 text-xs">
                        {isEn ? "Minimal influence on hospital stay length alone." : "Pengaruh minimal terhadap durasi rawat inap semata."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Case Study Explanation Box (Section 3.4 of Manuscript) */}
              <div className="bg-gradient-to-r from-red-950 to-gray-900 text-white p-6 sm:p-8 rounded-2xl shadow-md">
                <div className="flex items-center gap-2 text-xs font-bold text-red-300 uppercase tracking-widest mb-2">
                  <Microscope className="w-4 h-4 text-red-400" />
                  {isEn ? "Individual Patient Case Explanation (Section 3.4)" : "Studi Kasus Transparansi Prediksi Pasien (Bagian 3.4)"}
                </div>
                <h4 className="text-lg font-bold mb-3">
                  {isEn
                    ? "Patient Profile: 64 yo, CTP Class B, MELD 17, Active Sepsis & Hepatic Encephalopathy"
                    : "Profil Pasien Uji: 64 Tahun, CTP Kelas B, MELD 17, Sepsis Aktif & Ensefalopati Hepatikum"}
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
                  {isEn
                    ? "Laboratory findings showed marked urea elevation (96 mg/dL) and severe renal impairment (eGFR 26 mL/min/1.73m²), alongside bilirubin 0.4 mg/dL, creatinine 2.7 mg/dL, INR 1.11, AST 70 U/L, and sodium 136 mmol/L. The model predicted an elevated in-hospital mortality probability of 0.697 (vs. cohort average 0.499)."
                    : "Pemeriksaan laboratorium menunjukkan kenaikan tajam urea (96 mg/dL) dan disfungsi ginjal berat (eGFR 26 mL/min/1.73m²), bilirubin 0.4 mg/dL, kreatinin 2.7 mg/dL, INR 1.11, AST 70 U/L, dan natrium 136 mmol/L. Model memproyeksikan probabilitas kematian 0.697 (jauh di atas rata-rata dasar kohort 0.499)."}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white/10 p-3 rounded-xl">
                    <span className="text-red-300 font-medium block">Sepsis</span>
                    <span className="text-white font-extrabold text-sm">+0.15 SHAP</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl">
                    <span className="text-red-300 font-medium block">Urea 96 mg/dL</span>
                    <span className="text-white font-extrabold text-sm">+0.08 SHAP</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl">
                    <span className="text-red-300 font-medium block">eGFR 26 mL/min</span>
                    <span className="text-white font-extrabold text-sm">+0.06 SHAP</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl">
                    <span className="text-emerald-300 font-medium block">INR Normal (1.11)</span>
                    <span className="text-white font-extrabold text-sm">-0.11 SHAP (Offset)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 6: DOSING SYSTEM & CLINICAL CONCORDANCE */}
          {/* ------------------------------------------------------- */}
          {activeTab === "dosing" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {isEn ? "Dose Evaluation System & Clinical Validation" : "Sistem Evaluasi Dosis & Validasi Konkordansi (Tabel 4)"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {isEn
                    ? "Cohort appropriateness distribution across 8 medications and concordance validation against specialist adjudication."
                    : "Distribusi ketepatan dosis pada kohort rekam medis serta uji validasi konkordansi terhadap telaah klinis pakar."}
                </p>
              </div>

              {/* Table 2 Cohort Appropriateness Distribution */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-5 py-3.5 border-b border-gray-200">
                  <h3 className="font-bold text-sm text-gray-900">
                    {isEn ? "Real-world Dose Appropriateness Distribution (Table 2)" : "Distribusi Ketepatan Dosis di Dunia Nyata (Tabel 2 Manuskrip)"}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-left">
                    <thead>
                      <tr className="bg-gray-100/70 text-gray-700 border-b border-gray-200">
                        <th className="py-2.5 px-4 font-bold">{isEn ? "Medication Regimen" : "Regimen Obat"}</th>
                        <th className="py-2.5 px-4 font-bold text-center">n</th>
                        <th className="py-2.5 px-4 font-bold text-center text-emerald-800">
                          {isEn ? "Appropriate Count (%)" : "Sesuai / Tepat (%)"}
                        </th>
                        <th className="py-2.5 px-4 font-bold text-center text-red-800">
                          {isEn ? "Inappropriate Count (%)" : "Kurang Tepat (%)"}
                        </th>
                        <th className="py-2.5 px-4 font-bold">{isEn ? "Drug Class" : "Golongan"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {DOSE_APPROPRIATENESS_DATA.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-gray-900">{item.drug}</td>
                          <td className="py-2.5 px-4 text-center text-gray-600 font-mono tabular-nums">{item.n}</td>
                          <td className="py-2.5 px-4 text-center font-bold text-emerald-700 bg-emerald-50/30 font-mono tabular-nums">
                            {item.appropriateCount} ({item.appropriatePct})
                          </td>
                          <td className="py-2.5 px-4 text-center font-bold text-red-700 bg-red-50/30 font-mono tabular-nums">
                            {item.inappropriateCount} ({item.inappropriatePct})
                          </td>
                          <td className="py-2.5 px-4 text-gray-600">{item.category}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table 4 Concordance on 5 Stratified Patients */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-5 py-3.5 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold text-sm text-gray-900">
                    {isEn
                      ? "Concordance Validation Across 5 Stratified Patients (Table 4)"
                      : "Validasi Konkordansi pada 5 Pasien Representatif Bertingkat (Tabel 4 Manuskrip)"}
                  </h3>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    84.2% Agreement (16/19)
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-left">
                    <thead>
                      <tr className="bg-gray-100/70 text-gray-700 border-b border-gray-200">
                        <th className="py-2.5 px-3 font-bold">Pt</th>
                        <th className="py-2.5 px-3 font-bold">CTP</th>
                        <th className="py-2.5 px-3 font-bold">eGFR</th>
                        <th className="py-2.5 px-4 font-bold">{isEn ? "Drug Evaluated" : "Obat"}</th>
                        <th className="py-2.5 px-4 font-bold">{isEn ? "System Recommendation" : "Rekomendasi Sistem"}</th>
                        <th className="py-2.5 px-4 font-bold">{isEn ? "Clinical Expert Label" : "Label Klinis Pakar"}</th>
                        <th className="py-2.5 px-3 font-bold text-center">{isEn ? "Agreement" : "Kesesuaian"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {CONCORDANCE_CASES.map((c, idx) => {
                        const isConcordant = c.agreement.includes("Concordant");
                        return (
                          <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-gray-700">P{c.patient}</td>
                            <td className="py-2.5 px-3 font-bold text-red-900">{c.ctp}</td>
                            <td className="py-2.5 px-3 text-gray-600 font-mono tabular-nums">{c.egfr}</td>
                            <td className="py-2.5 px-4 font-medium text-gray-900">{c.drug}</td>
                            <td className="py-2.5 px-4 text-gray-700 text-xs">{c.systemRecommendation}</td>
                            <td className="py-2.5 px-4 text-gray-600 text-xs">{c.clinicalLabel}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                  isConcordant
                                    ? "bg-emerald-100 text-emerald-900"
                                    : "bg-red-100 text-red-900"
                                }`}
                              >
                                {c.agreement}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 7: CLINICAL GUIDELINES & FULL SCIENTIFIC REFERENCES */}
          {/* ------------------------------------------------------- */}
          {activeTab === "references" && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {isEn ? "Clinical Guidelines & Scientific References" : "Pedoman Klinis & Daftar Pustaka Ilmiah"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {isEn
                    ? "Official international consensus guidance and the complete peer-reviewed literature base from the CirrhoSmart AI manuscript."
                    : "Pedoman konsensus internasional resmi serta pustaka ilmiah lengkap yang dikutip dalam naskah penelitian CirrhoSmart AI."}
                </p>
              </div>

              {/* Core Guidelines Cards */}
              <div>
                <h3 className="text-base font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-red-800" />
                  {isEn ? "Primary Clinical Reference Standards (Section 2.3)" : "Standar Acuan Klinis Utama (Bagian 2.3 Manuskrip)"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border-2 border-red-100 hover:border-red-300 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-red-100 text-red-900 rounded-md">
                        AASLD 2021
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      {isEn ? "AASLD Practice Guidance" : "Panduan Praktik AASLD (2021)"}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {isEn
                        ? "Diagnosis, evaluation, and management of ascites, SBP, and hepatorenal syndrome. Defines diuretic titration and beta-blocker safety cutoffs."
                        : "Tata laksana asites, SBP, dan sindrom hepatorenal. Mengatur rasio Spironolakton:Furosemid (100:40) serta batasan keamanan beta-bloker."}
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-100 text-blue-900 rounded-md">
                        EASL 2018
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      {isEn ? "EASL Decompensated Cirrhosis" : "Pedoman Klinis EASL (2018)"}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {isEn
                        ? "Comprehensive clinical practice guidelines for management of patients with decompensated cirrhosis and hemodynamic monitoring criteria."
                        : "Pedoman penatalaksanaan dekompensasi sirosis, pemantauan MAP, serta pencegahan komplikasi ensefalopati dan perdarahan varises."}
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border-2 border-purple-100 hover:border-purple-300 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-purple-100 text-purple-900 rounded-md">
                        KDIGO / FDA / Lexicomp
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      {isEn ? "Renal Dosing & Drug Compendia" : "Dosis Renal & Kompendia Obat"}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {isEn
                        ? "Kidney Disease: Improving Global Outcomes (KDIGO) renal thresholds, FDA prescribing information, UpToDate, and Lexicomp drug databases."
                        : "Pedoman KDIGO untuk penyesuaian dosis pada gangguan ginjal, label resmi FDA, basis data Lexicomp®, UpToDate®, Drugs.com, dan Medscape."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Search and Filter Controls */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={refSearch}
                    onChange={(e) => setRefSearch(e.target.value)}
                    placeholder={
                      dict?.methodology?.search_placeholder ||
                      (isEn
                        ? "Search by author, title, journal, or DOI..."
                        : "Cari berdasarkan penulis, judul, jurnal, atau DOI...")
                    }
                    className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-all"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
                  <Filter className="w-4 h-4 text-gray-400 shrink-0 mr-1" />
                  {[
                    { id: "all", label: isEn ? "All" : "Semua" },
                    { id: "guideline", label: isEn ? "Guidelines" : "Pedoman" },
                    { id: "pk_dosing", label: isEn ? "Dosing & PK" : "Dosis & PK" },
                    { id: "ml_ai", label: "AI / ML" },
                    { id: "prognosis", label: isEn ? "Prognosis" : "Prognosis" },
                  ].map((filterItem) => (
                    <button
                      key={filterItem.id}
                      onClick={() => setRefCategory(filterItem.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        refCategory === filterItem.id
                          ? "bg-red-900 text-white shadow-sm"
                          : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200"
                      }`}
                    >
                      {filterItem.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reference List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-gray-500 px-1">
                  <span>
                    {isEn ? "Displaying" : "Menampilkan"}{" "}
                    <strong className="text-gray-900">{filteredReferences.length}</strong>{" "}
                    {isEn ? "scientific references" : "referensi pustaka"}
                  </span>
                  {refSearch && (
                    <button
                      onClick={() => setRefSearch("")}
                      className="text-red-800 font-bold hover:underline"
                    >
                      {isEn ? "Reset Search" : "Hapus Pencarian"}
                    </button>
                  )}
                </div>

                <div className="divide-y divide-gray-100 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  {filteredReferences.map((ref) => (
                    <div
                      key={ref.id}
                      className={`p-4 sm:p-5 hover:bg-gray-50/70 transition-colors ${
                        ref.highlight ? "bg-red-50/50 ring-1 ring-inset ring-red-200 rounded-xl my-1" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-extrabold text-red-900 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                              [{ref.id}]
                            </span>
                            <span className="text-xs font-bold text-gray-800">
                              {ref.authors} ({ref.year})
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                              {ref.category.replace("_", " ")}
                            </span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                            {ref.title}
                          </h4>

                          <p className="text-xs text-gray-600 italic">
                            {ref.journal}
                            {ref.volumeIssuePages ? `; ${ref.volumeIssuePages}` : ""}
                          </p>
                        </div>

                        {ref.url && (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50/60 hover:bg-red-900 text-red-900 hover:text-white border border-red-200/70 text-xs font-bold transition-all shrink-0 active:scale-95"
                            title={ref.doi ? `DOI: ${ref.doi}` : "Link Referensi"}
                          >
                            <span>DOI</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredReferences.length === 0 && (
                    <div className="py-12 text-center text-gray-500 text-sm">
                      <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      {isEn
                        ? "No scientific references matched your query."
                        : "Tidak ada referensi yang cocok dengan kata kunci pencarian Anda."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}