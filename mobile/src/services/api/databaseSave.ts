import type {
  DatabaseSaveLosRequest,
  DatabaseSaveMortalityRequest,
  DatabaseSaveResponse,
  LosPredictRequest,
  MortalityPredictRequest,
  MortalityPredictResponse,
} from '@/types/api';
import type { Gender } from '@/types/clinical';
import { postJson, type PostJsonOptions } from './client';

export function buildMortalitySavePayload(params: {
  input: MortalityPredictRequest;
  result: MortalityPredictResponse;
  token: string;
  patientName?: string;
  medicalRecordNumber?: string;
}): DatabaseSaveMortalityRequest {
  const { input, result, token, patientName, medicalRecordNumber } = params;
  const trimmedToken = token.trim();
  if (!trimmedToken) {
    throw new Error('Authorization token is required.');
  }

  const payload: DatabaseSaveMortalityRequest = {
    ...input,
    probability: result.probability,
    predicted_class: result.predicted_class,
    base_value: result.base_value,
    // Prisma schema defines shapContributions as non-nullable Json
    shap_contributions: Array.isArray(result.shap_contributions)
      ? result.shap_contributions
      : [],
    token: trimmedToken,
  };

  if (patientName?.trim()) {
    payload.nama_pasien = patientName.trim();
  }
  if (medicalRecordNumber?.trim()) {
    payload.rekam_medis = medicalRecordNumber.trim();
  }

  return payload;
}

export function buildLosSavePayload(params: {
  input: LosPredictRequest;
  gender: Gender;
  probabilityLos: number;
  meldScore: number;
  token: string;
  patientName?: string;
  medicalRecordNumber?: string;
}): DatabaseSaveLosRequest {
  const {
    input,
    gender,
    probabilityLos,
    meldScore,
    token,
    patientName,
    medicalRecordNumber,
  } = params;
  const trimmedToken = token.trim();
  if (!trimmedToken) {
    throw new Error('Authorization token is required.');
  }

  const payload: DatabaseSaveLosRequest = {
    ...input,
    jk: gender,
    probability_los: probabilityLos,
    meldScore: Number.isFinite(meldScore) ? meldScore : 0,
    token: trimmedToken,
  };

  if (patientName?.trim()) {
    payload.nama_pasien = patientName.trim();
  }
  if (medicalRecordNumber?.trim()) {
    payload.rekam_medis = medicalRecordNumber.trim();
  }

  return payload;
}

export async function savePredictionToDatabase(
  payload: DatabaseSaveMortalityRequest | DatabaseSaveLosRequest,
  options?: PostJsonOptions
): Promise<DatabaseSaveResponse> {
  return postJson<
    DatabaseSaveMortalityRequest | DatabaseSaveLosRequest,
    DatabaseSaveResponse
  >('/api/database/save', payload, options);
}
