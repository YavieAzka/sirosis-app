import type {
  BinaryFlag,
  CtpClass,
  CtpEncoded,
  CtpParamKey,
  CtpParams,
  CtpResult,
  CtpScoreValue,
  DrugId,
  Gender,
} from '@/types/clinical';

export const CTP_CLASS_TO_ENCODED: Record<CtpClass, CtpEncoded> = {
  A: 1,
  B: 2,
  C: 3,
};

export const CTP_OPTIONS: Record<
  CtpParamKey,
  { value: CtpScoreValue; labelKey: string; fallbackLabel: string }[]
> = {
  bilirubin: [
    {
      value: '1',
      labelKey: 'calculators.ctp.options.bilirubin.1',
      fallbackLabel: '<2 mg/dL (<34.2 µmol/L)',
    },
    {
      value: '2',
      labelKey: 'calculators.ctp.options.bilirubin.2',
      fallbackLabel: '2-3 mg/dL (34.2-51.3 µmol/L)',
    },
    {
      value: '3',
      labelKey: 'calculators.ctp.options.bilirubin.3',
      fallbackLabel: '>3 mg/dL (>51.3 µmol/L)',
    },
  ],
  albumin: [
    {
      value: '1',
      labelKey: 'calculators.ctp.options.albumin.1',
      fallbackLabel: '>3.5 g/dL (>35 g/L)',
    },
    {
      value: '2',
      labelKey: 'calculators.ctp.options.albumin.2',
      fallbackLabel: '2.8-3.5 g/dL (28-35 g/L)',
    },
    {
      value: '3',
      labelKey: 'calculators.ctp.options.albumin.3',
      fallbackLabel: '<2.8 g/dL (<28 g/L)',
    },
  ],
  inr: [
    {
      value: '1',
      labelKey: 'calculators.ctp.options.inr.1',
      fallbackLabel: '<1.7',
    },
    {
      value: '2',
      labelKey: 'calculators.ctp.options.inr.2',
      fallbackLabel: '1.7-2.3',
    },
    {
      value: '3',
      labelKey: 'calculators.ctp.options.inr.3',
      fallbackLabel: '>2.3',
    },
  ],
  ascites: [
    {
      value: '1',
      labelKey: 'calculators.ctp.options.ascites.1',
      fallbackLabel: 'Absent (Tidak Ada)',
    },
    {
      value: '2',
      labelKey: 'calculators.ctp.options.ascites.2',
      fallbackLabel: 'Slight (Ringan)',
    },
    {
      value: '3',
      labelKey: 'calculators.ctp.options.ascites.3',
      fallbackLabel: 'Moderate (Sedang-Berat)',
    },
  ],
  encephalopathy: [
    {
      value: '1',
      labelKey: 'calculators.ctp.options.encephalopathy.1',
      fallbackLabel: 'No Encephalopathy',
    },
    {
      value: '2',
      labelKey: 'calculators.ctp.options.encephalopathy.2',
      fallbackLabel: 'Grade 1-2',
    },
    {
      value: '3',
      labelKey: 'calculators.ctp.options.encephalopathy.3',
      fallbackLabel: 'Grade 3-4',
    },
  ],
};

export function hitungSkorCtp(params: CtpParams): CtpResult | null {
  const { bilirubin, albumin, inr, ascites, encephalopathy } = params;
  if (!bilirubin || !albumin || !inr || !ascites || !encephalopathy) {
    return null;
  }
  const total =
    Number(bilirubin) +
    Number(albumin) +
    Number(inr) +
    Number(ascites) +
    Number(encephalopathy);

  let kelas: CtpClass;
  if (total <= 6) kelas = 'A';
  else if (total <= 9) kelas = 'B';
  else kelas = 'C';

  return {
    total,
    kelas,
    encoded: CTP_CLASS_TO_ENCODED[kelas],
  };
}

export function shouldSyncEncephalopathyFlag(
  encephalopathyScore: CtpScoreValue | ''
): BinaryFlag {
  return Number(encephalopathyScore) >= 2 ? 1 : 0;
}

export function hitungGfrCkdEpi(
  scr: number,
  age: number,
  gender: Gender
): string | null {
  if (
    !Number.isFinite(scr) ||
    !Number.isFinite(age) ||
    scr <= 0 ||
    age <= 0
  ) {
    return null;
  }
  const k = gender === 'P' ? 0.7 : 0.9;
  const alpha = gender === 'P' ? -0.241 : -0.302;
  const minVal = Math.min(scr / k, 1);
  const maxVal = Math.max(scr / k, 1);
  const genderMultiplier = gender === 'P' ? 1.012 : 1;
  const egfr =
    142 *
    Math.pow(minVal, alpha) *
    Math.pow(maxVal, -1.2) *
    Math.pow(0.9938, age) *
    genderMultiplier;
  return egfr.toFixed(2);
}

export function hitungInr(
  ptPatient: number,
  ptNormal: number,
  isi: number
): string | null {
  if (
    !Number.isFinite(ptPatient) ||
    !Number.isFinite(ptNormal) ||
    !Number.isFinite(isi) ||
    ptPatient <= 0 ||
    ptNormal <= 0 ||
    isi <= 0
  ) {
    return null;
  }
  return Math.pow(ptPatient / ptNormal, isi).toFixed(2);
}

export function hitungMap(sbp: number, dbp: number): string | null {
  if (
    !Number.isFinite(sbp) ||
    !Number.isFinite(dbp) ||
    sbp <= 0 ||
    dbp <= 0
  ) {
    return null;
  }
  return ((sbp + 2 * dbp) / 3).toFixed(2);
}

/**
 * Computes the UNOS MELD score matching `web/api/predict_los.py` (`hitung_meld_dinamis`):
 * applies a 1.0 floor to bilirubin, INR, and creatinine, and caps creatinine at 4.0 mg/dL.
 */
export function hitungMeldUnos(
  bilirubin: number,
  inr: number,
  kreatinin: number
): string | null {
  if (
    !Number.isFinite(bilirubin) ||
    !Number.isFinite(inr) ||
    !Number.isFinite(kreatinin) ||
    bilirubin <= 0 ||
    inr <= 0 ||
    kreatinin <= 0
  ) {
    return null;
  }
  const bil = Math.max(bilirubin, 1.0);
  const inrVal = Math.max(inr, 1.0);
  const kre = Math.min(Math.max(kreatinin, 1.0), 4.0);
  const raw =
    3.78 * Math.log(bil) +
    11.2 * Math.log(inrVal) +
    9.57 * Math.log(kre) +
    6.43;
  const rounded = Math.round(raw * 10) / 10;
  return rounded.toFixed(1);
}

export const ALL_DRUG_IDS: DrugId[] = [
  'spiro_furo',
  'spironolakton',
  'furosemid',
  'propranolol',
  'carvedilol',
  'ampisilin_sulbaktam',
  'azitromisin',
  'levofloxacin',
];

export type DoseStatusTone = 'danger' | 'warning' | 'safe' | 'neutral';

export function classifyDoseStatusTone(status: string): DoseStatusTone {
  if (status.includes('Avoid') || status.includes('Hindari')) {
    return 'danger';
  }
  if (
    status.includes('Reduce') ||
    status.includes('Kurangi') ||
    status.includes('Monitor')
  ) {
    return 'warning';
  }
  if (status === 'N/A' || status === 'Belum Tersedia') {
    return 'neutral';
  }
  return 'safe';
}
