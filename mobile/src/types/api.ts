import type {
  BinaryFlag,
  CtpClass,
  CtpEncoded,
  DrugId,
  Gender,
} from './clinical';

export interface MortalityPredictRequest {
  komor_sepsis: BinaryFlag;
  urea_baseline: number;
  natrium_baseline: number;
  komp_eh: BinaryFlag;
  inr_baseline: number;
  sgot_baseline: number;
  gfr: number;
  ctp_encoded: CtpEncoded;
}

export interface ShapContribution {
  feature: string;
  contribution: number;
  value_input: number;
}

export interface MortalityPredictResponse {
  probability: number;
  predicted_class: BinaryFlag;
  base_value: number;
  shap_contributions: ShapContribution[];
}

export interface LosPredictRequest {
  komor_sepsis: BinaryFlag;
  komp_eh: BinaryFlag;
  ctp_encoded: CtpEncoded;
  bilirubin_baseline: number;
  kreatinin_baseline: number;
  inr_baseline: number;
  sgot_baseline: number;
  usia: number;
  gfr: number;
}

export interface LosPredictResponse {
  probability_los: number;
}

export interface DosePredictRequest {
  gfr: number;
  ctp: CtpClass;
  map_value: number | null;
  ascites_refrakter: BinaryFlag;
  hrs: BinaryFlag;
  gagal_ginjal_akut: BinaryFlag;
  sepsis_pneumonia: BinaryFlag;
  ast_alt_tinggi: BinaryFlag;
  obat_pilihan: DrugId[];
}

export interface DoseRecommendationItem {
  obat: string;
  status: string;
  rentang_dosis: string;
  alasan: string;
  peringatan: string[];
}

export type DosePredictResponse = Partial<
  Record<DrugId, DoseRecommendationItem>
> & {
  info?: DoseRecommendationItem;
};

export interface DatabaseSaveMortalityRequest extends MortalityPredictRequest {
  token: string;
  nama_pasien?: string;
  rekam_medis?: string;
  probability: number;
  predicted_class: BinaryFlag;
  base_value: number;
  shap_contributions: ShapContribution[];
}

export interface DatabaseSaveLosRequest extends LosPredictRequest {
  token: string;
  nama_pasien?: string;
  rekam_medis?: string;
  jk: Gender;
  probability_los: number;
  meldScore: number;
}

export interface DatabaseSaveResponse {
  success: boolean;
  data: {
    patient: unknown;
    mortality: unknown | null;
    los: unknown | null;
  };
}

export type ApiErrorCode =
  | 'CONFIG'
  | 'OFFLINE'
  | 'TIMEOUT'
  | 'UNAUTHORIZED'
  | 'SERVER'
  | 'NETWORK'
  | 'PARSE';
