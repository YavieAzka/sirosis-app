export type CtpParamKey =
  | 'bilirubin'
  | 'albumin'
  | 'inr'
  | 'ascites'
  | 'encephalopathy';

export type CtpScoreValue = '1' | '2' | '3';

export type CtpParams = Record<CtpParamKey, CtpScoreValue | ''>;

export type CtpClass = 'A' | 'B' | 'C';

export type CtpEncoded = 1 | 2 | 3;

export type Gender = 'L' | 'P';

export type BinaryFlag = 0 | 1;

export type DrugId =
  | 'spiro_furo'
  | 'spironolakton'
  | 'furosemid'
  | 'propranolol'
  | 'carvedilol'
  | 'ampisilin_sulbaktam'
  | 'azitromisin'
  | 'levofloxacin';

export interface CtpResult {
  total: number;
  kelas: CtpClass;
  encoded: CtpEncoded;
}

export interface MortalityFormState {
  komor_sepsis: BinaryFlag;
  urea_baseline: string;
  natrium_baseline: string;
  komp_eh: BinaryFlag;
  inr_baseline: string;
  sgot_baseline: string;
  gfr: string;
  ctp_encoded: CtpEncoded;
}

export interface LosFormState {
  komor_sepsis: BinaryFlag;
  komp_eh: BinaryFlag;
  ctp_encoded: CtpEncoded;
  bilirubin_baseline: string;
  kreatinin_baseline: string;
  inr_baseline: string;
  sgot_baseline: string;
  usia: string;
  gfr: string;
  jk: Gender;
}

export interface DoseFormState {
  gfr: string;
  ctp: CtpClass;
  map_value: string;
  ascites_refrakter: BinaryFlag;
  hrs: BinaryFlag;
  sepsis_pneumonia: BinaryFlag;
  ast_alt_tinggi: BinaryFlag;
  isCKD: boolean;
  isAKI: boolean;
  obat_pilihan: Record<DrugId, boolean>;
}
