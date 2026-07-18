// File: components/ClientHome.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
// Perubahan path import karena file ini sekarang berada di dalam folder components
import MainApp from "./MainApp";
import UserGuide from "./UserGuide";
import Methodology from "./Methodology";
import AboutTeam from "./AboutTeam";

type ViewType = "app" | "guide" | "methodology" | "about";

// Menerima parameter dict dari page.tsx
export default function ClientHome({
  lang,
  dict,
}: {
  lang: string;
  dict: any;
}) {
  const [currentView, setCurrentView] = useState<ViewType>("app");

  const router = useRouter();
  const pathname = usePathname();
  const switchLanguage = (newLang: string) => {
    if (lang === newLang) return; // Abaikan jika mengklik bahasa yang sedang aktif
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(newPath);
  };

  const desktopRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [desktopIndicator, setDesktopIndicator] = useState({
    left: 0,
    width: 0,
  });
  const [mobileIndicator, setMobileIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const updateIndicator = () => {
      const viewToIndex: Record<string, number> = {
        app: 0,
        guide: 1,
        methodology: 2,
        about: 3,
      };
      const index = viewToIndex[currentView];

      const desktopEl = desktopRefs.current[index];
      if (desktopEl) {
        setDesktopIndicator({
          left: desktopEl.offsetLeft,
          width: desktopEl.offsetWidth,
        });
      }

      const mobileEl = mobileRefs.current[index];
      if (mobileEl) {
        setMobileIndicator({
          left: mobileEl.offsetLeft,
          width: mobileEl.offsetWidth,
        });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [currentView]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center h-full">
              <div
                className="shrink-0 flex items-center cursor-pointer mr-8"
                onClick={() => setCurrentView("app")}
              >
                <span className="font-black text-red-900 text-xl tracking-tight">
                  CirrhoSmartAI
                </span>
              </div>

              {/* Contoh penerapan dictionary di Desktop Navbar */}
              <div className="hidden md:flex relative h-full">
                <button
                  ref={(el) => {
                    desktopRefs.current[0] = el;
                  }}
                  onClick={() => setCurrentView("app")}
                  className={`inline-flex items-center px-4 h-full text-sm font-bold transition-colors duration-300 z-10 ${currentView === "app" ? "text-red-900" : "text-gray-500 hover:text-gray-800"}`}
                >
                  {dict.nav?.calculator || "Kalkulator Klinis"}
                </button>
                <button
                  ref={(el) => {
                    desktopRefs.current[1] = el;
                  }}
                  onClick={() => setCurrentView("guide")}
                  className={`inline-flex items-center px-4 h-full text-sm font-bold transition-colors duration-300 z-10 ${currentView === "guide" ? "text-red-900" : "text-gray-500 hover:text-gray-800"}`}
                >
                  {dict.nav?.guide || "Panduan"}
                </button>
                <button
                  ref={(el) => {
                    desktopRefs.current[2] = el;
                  }}
                  onClick={() => setCurrentView("methodology")}
                  className={`inline-flex items-center px-4 h-full text-sm font-bold transition-colors duration-300 z-10 ${currentView === "methodology" ? "text-red-900" : "text-gray-500 hover:text-gray-800"}`}
                >
                  {dict.nav?.methodology || "Metodologi & Referensi"}
                </button>
                <button
                  ref={(el) => {
                    desktopRefs.current[3] = el;
                  }}
                  onClick={() => setCurrentView("about")}
                  className={`inline-flex items-center px-4 h-full text-sm font-bold transition-colors duration-300 z-10 ${currentView === "about" ? "text-red-900" : "text-gray-500 hover:text-gray-800"}`}
                >
                  {dict.nav?.team || "Tim Peneliti"}
                </button>

                <div
                  className="absolute bottom-0 h-0.5 bg-red-800 transition-all duration-300 ease-out"
                  style={{
                    left: desktopIndicator.left,
                    width: desktopIndicator.width,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center ml-auto">
              <div className="flex bg-gray-100 p-1 rounded-lg shadow-inner">
                <button
                  onClick={() => switchLanguage("id")}
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-md transition-all duration-300 ${
                    lang === "id"
                      ? "bg-white text-red-900 shadow-sm ring-1 ring-gray-200/50"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  ID
                </button>
                <button
                  onClick={() => switchLanguage("en")}
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-md transition-all duration-300 ${
                    lang === "en"
                      ? "bg-white text-red-900 shadow-sm ring-1 ring-gray-200/50"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contoh penerapan dictionary di Mobile Navbar */}
        <div className="md:hidden overflow-x-auto border-t border-gray-100 bg-gray-50/80 backdrop-blur">
          <div className="flex relative w-max min-w-full">
            <button
              ref={(el) => {
                mobileRefs.current[0] = el;
              }}
              onClick={() => setCurrentView("app")}
              className={`px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-colors duration-300 z-10 ${currentView === "app" ? "text-red-900" : "text-gray-500"}`}
            >
              {dict.nav?.calculator_short || "Kalkulator"}
            </button>
            <button
              ref={(el) => {
                mobileRefs.current[1] = el;
              }}
              onClick={() => setCurrentView("guide")}
              className={`px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-colors duration-300 z-10 ${currentView === "guide" ? "text-red-900" : "text-gray-500"}`}
            >
              {dict.nav?.guide || "Panduan"}
            </button>
            <button
              ref={(el) => {
                mobileRefs.current[2] = el;
              }}
              onClick={() => setCurrentView("methodology")}
              className={`px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-colors duration-300 z-10 ${currentView === "methodology" ? "text-red-900" : "text-gray-500"}`}
            >
              {dict.nav?.methodology_short || "Metodologi"}
            </button>
            <button
              ref={(el) => {
                mobileRefs.current[3] = el;
              }}
              onClick={() => setCurrentView("about")}
              className={`px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-colors duration-300 z-10 ${currentView === "about" ? "text-red-900" : "text-gray-500"}`}
            >
              {dict.nav?.team_short || "Tim"}
            </button>

            <div
              className="absolute bottom-0 h-0.5 bg-red-800 transition-all duration-300 ease-out z-20"
              style={{
                left: mobileIndicator.left,
                width: mobileIndicator.width,
              }}
            />
          </div>
        </div>
      </nav>

      <div className="flex-grow">
        {/* Teruskan juga dict ke komponen anak agar mereka bisa menggunakannya */}
        {currentView === "app" && <MainApp dict={dict} />}
        {currentView === "guide" && <UserGuide dict={dict} />}
        {currentView === "methodology" && <Methodology dict={dict} />}
        {currentView === "about" && <AboutTeam dict={dict} />}
      </div>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-6 shadow-inner">
            <h4 className="text-amber-900 font-extrabold text-sm uppercase tracking-wider mb-2 flex items-center">
              <span className="text-lg mr-2">⚠️</span>{" "}
              {dict.footer?.disclaimer_title ||
                "Sanggahan Medis (Medical Disclaimer)"}
            </h4>
            <p className="text-amber-800 text-sm leading-relaxed text-justify">
              {dict.footer?.disclaimer_text ||
                "Aplikasi Clinical Decision Support System (CDSS) ini merupakan instrumen purwarupa yang dikembangkan untuk tujuan riset akademis dan TIDAK ditujukan sebagai pengganti dari penilaian, diagnosis, maupun saran medis profesional. Seluruh hasil prediksi kecerdasan buatan (probabilitas mortalitas/LoS) maupun rekomendasi dosis yang dihasilkan oleh sistem (rule engine) wajib dianalisis ulang. Keputusan akhir mengenai tata laksana farmakoterapi dan penyesuaian dosis obat tetap mutlak berada di tangan Dokter Penanggung Jawab Pelayanan (DPJP) dan Apoteker Klinis yang menangani pasien."}
            </p>
          </div>
          <div className="text-center text-sm text-gray-500 font-medium">
            <p>
              &copy; {new Date().getFullYear()}{" "}
              {dict.footer?.rights ||
                "CirrhoSmartAI Research Project. All rights reserved."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
