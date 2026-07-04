// File: utils/clinical.ts

export type CtpParamKey = 'bilirubin' | 'albumin' | 'inr' | 'ascites' | 'encephalopathy';
export type CtpParams = Record<CtpParamKey, string>;

export const CTP_OPTIONS: Record<CtpParamKey, { value: string; label: string }[]> = {
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

export const CTP_PARAM_LABELS: Record<CtpParamKey, string> = {
  bilirubin: 'Bilirubin (Total)',
  albumin: 'Albumin',
  inr: 'INR',
  ascites: 'Ascites',
  encephalopathy: 'Encephalopathy',
};

export function hitungSkorCtp(params: CtpParams): { total: number; kelas: 'A' | 'B' | 'C' } | null {
  const { bilirubin, albumin, inr, ascites, encephalopathy } = params;
  if (!bilirubin || !albumin || !inr || !ascites || !encephalopathy) return null;
  const total = Number(bilirubin) + Number(albumin) + Number(inr) + Number(ascites) + Number(encephalopathy);
  let kelas: 'A' | 'B' | 'C';
  if (total <= 6) kelas = 'A';
  else if (total <= 9) kelas = 'B';
  else kelas = 'C';
  return { total, kelas };
}

export function hitungGfrCkdEpi(scr: number, age: number, gender: 'L' | 'P'): string {
  const k = gender === 'P' ? 0.7 : 0.9;
  const alpha = gender === 'P' ? -0.241 : -0.302;
  const minVal = Math.min(scr / k, 1);
  const maxVal = Math.max(scr / k, 1);
  const genderMultiplier = gender === 'P' ? 1.012 : 1;
  const egfr = 142 * Math.pow(minVal, alpha) * Math.pow(maxVal, -1.200) * Math.pow(0.9938, age) * genderMultiplier;
  return egfr.toFixed(2);
}