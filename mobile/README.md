# CirrhoSmart AI Mobile (Android)

Proyek mobile React Native (Expo SDK 58 + TypeScript + Expo Router) untuk **CirrhoSmart AI**, difokuskan pada target **Android**.

## Prasyarat Lokal (Windows)

1. Pastikan `JAVA_HOME` mengarah ke JDK 17/21 dan `%JAVA_HOME%\bin` berada di urutan teratas `PATH` (di atas `Oracle\Java\javapath` bila ada versi JDK lain).
2. Selesaikan setup **Android Studio → SDK Manager** (Android SDK Platform, Platform-Tools/`adb`, dan Emulator) lalu set `ANDROID_HOME` beserta `%ANDROID_HOME%\platform-tools` di `PATH`.
3. Salin `.env.example` menjadi `.env` (sudah tersedia untuk pengembangan lokal) dan sesuaikan `EXPO_PUBLIC_API_URL` ke URL backend Vercel atau `http://10.0.2.2:3000` untuk Android Emulator.

## Skrip Tersedia

```bash
npm install
npm run start       # Jalankan Metro bundler Expo
npm run android     # Jalankan di Emulator / perangkat Android
npm run lint        # Jalankan ESLint (expo lint)
npm run typecheck   # Cek TypeScript (tsc --noEmit)
```
