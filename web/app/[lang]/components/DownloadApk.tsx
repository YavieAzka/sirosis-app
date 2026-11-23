// File: app/[lang]/components/DownloadApk.tsx
"use client";

import React from "react";
import {
  CheckCircle2,
  Download,
  ExternalLink,
  ShieldAlert,
  Smartphone,
} from "lucide-react";

const RELEASE_PAGE_URL =
  "https://github.com/YavieAzka/sirosis-app/releases/tag/apk-v0.1.0";
const DIRECT_APK_URL =
  "https://github.com/YavieAzka/sirosis-app/releases/download/apk-v0.1.0/cirrhosmart-ai.apk";

interface DownloadDict {
  download?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    btn_download?: string;
    btn_release?: string;
    meta_version_label?: string;
    meta_version_value?: string;
    meta_size_label?: string;
    meta_size_value?: string;
    meta_platform_label?: string;
    meta_platform_value?: string;
    steps_title?: string;
    steps_subtitle?: string;
    step1_title?: string;
    step1_desc?: string;
    step2_title?: string;
    step2_desc?: string;
    step3_title?: string;
    step3_desc?: string;
    step4_title?: string;
    step4_desc?: string;
    note_title?: string;
    note_desc?: string;
  };
}

export default function DownloadApk({ dict }: { dict: DownloadDict }) {
  const d = dict.download ?? {};

  const stripStepPrefix = (title: string) => title.replace(/^\d+\.\s*/, "");

  const steps = [
    {
      id: 1,
      title: stripStepPrefix(d.step1_title || "Unduh Installer .APK"),
      desc:
        d.step1_desc ||
        "Ketuk tombol Download APK di atas melalui browser Android Anda dan tunggu hingga cirrhosmart-ai.apk selesai diunduh.",
    },
    {
      id: 2,
      title: stripStepPrefix(d.step2_title || "Buka File yang Terunduh"),
      desc:
        d.step2_desc ||
        "Ketuk notifikasi unduhan selesai atau buka aplikasi Files / File Saya → Downloads → cirrhosmart-ai.apk.",
    },
    {
      id: 3,
      title: stripStepPrefix(
        d.step3_title || "Izinkan Instalasi Sumber Eksternal"
      ),
      desc:
        d.step3_desc ||
        "Jika muncul peringatan keamanan Android, ketuk Setelan / Settings, aktifkan Izinkan dari sumber ini, lalu kembali.",
    },
    {
      id: 4,
      title: stripStepPrefix(
        d.step4_title || "Pasang & Terima Update Patch Otomatis"
      ),
      desc:
        d.step4_desc ||
        "Ketuk Install dan buka CirrhoSmart AI. Pembaruan berikutnya hadir otomatis lewat notifikasi di dalam aplikasi.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-8 animate-fade-in">
      {/* Hero & Direct Download Card */}
      <section className="rounded-3xl bg-gradient-to-br from-red-950 via-red-900 to-rose-950 text-white p-7 sm:p-10 shadow-xl border border-red-800/60 space-y-6">
        <div className="space-y-3 max-w-2xl">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {d.title || "Download CirrhoSmart AI untuk Android"}
          </h1>
          <p className="text-sm sm:text-base text-red-100 leading-relaxed max-w-[65ch]">
            {d.subtitle ||
              "Gunakan kalkulator klinis, prediksi mortalitas berbasis SHAP, prediksi lama rawat (LoS), serta rekomendasi dosis personal langsung dari ponsel atau tablet bangsal Anda."}
          </p>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-white/15 py-4 text-sm">
          <div>
            <dt className="text-xs text-red-200">
              {d.meta_version_label || "Rilis"}
            </dt>
            <dd className="font-bold font-mono text-white mt-0.5 tabular-nums">
              {d.meta_version_value || "apk-v0.1.0"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-red-200">
              {d.meta_size_label || "Ukuran File"}
            </dt>
            <dd className="font-bold font-mono text-white mt-0.5 tabular-nums">
              {d.meta_size_value || "~104 MB (.apk)"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-red-200">
              {d.meta_platform_label || "Perangkat"}
            </dt>
            <dd className="font-bold text-white mt-0.5 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-red-200 shrink-0" />
              <span>{d.meta_platform_value || "Android Phone & Tablet"}</span>
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={DIRECT_APK_URL}
            download="cirrhosmart-ai.apk"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-red-950 hover:bg-red-50 font-extrabold text-sm sm:text-base transition-colors shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Download className="w-5 h-5 text-red-800" />
            <span>{d.btn_download || "Download APK (cirrhosmart-ai.apk)"}</span>
          </a>

          <a
            href={RELEASE_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-red-900/70 hover:bg-red-800 text-white border border-red-700/70 font-bold text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span>{d.btn_release || "Lihat Halaman GitHub Release"}</span>
            <ExternalLink className="w-4 h-4 text-red-200" />
          </a>
        </div>

        <p className="text-xs text-red-200">
          {d.badge || "Aplikasi Android (Distribusi Internal)"}
        </p>
      </section>

      {/* Step-by-Step Installation Guide */}
      <section className="bg-white rounded-3xl shadow-md border border-gray-200 p-7 sm:p-10">
        <div className="border-b border-gray-100 pb-5 space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-red-900 tracking-tight">
            {d.steps_title || "Cara Mendownload & Menginstall di Android"}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-[68ch]">
            {d.steps_subtitle ||
              "Ikuti 4 langkah singkat berikut untuk memasang aplikasi di perangkat Android Anda:"}
          </p>
        </div>

        <ol className="divide-y divide-gray-100">
          {steps.map((step) => (
            <li
              key={step.id}
              className="py-5 first:pt-6 last:pb-5 flex items-start gap-4"
            >
              <span
                aria-hidden="true"
                className="w-9 h-9 rounded-full bg-red-100 text-red-900 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 tabular-nums"
              >
                {step.id}
              </span>
              <div className="space-y-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[68ch]">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Security & Play Protect Note */}
        <div className="border-t border-gray-100 pt-5 space-y-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <p className="font-bold text-gray-900">
                {d.note_title || "Catatan Keamanan Google Play Protect"}
              </p>
              <p className="leading-relaxed text-gray-600 max-w-[68ch]">
                {d.note_desc ||
                  "Apabila Android atau Google Play Protect menampilkan konfirmasi aplikasi internal, pilih Selengkapnya (More details) lalu pilih Tetap pasang (Install anyway)."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-gray-600 pt-3 border-t border-gray-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span className="leading-relaxed break-all">
              Direct APK:{" "}
              <a
                href={DIRECT_APK_URL}
                download="cirrhosmart-ai.apk"
                className="font-mono text-gray-800 hover:text-red-800 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
              >
                {DIRECT_APK_URL}
              </a>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
