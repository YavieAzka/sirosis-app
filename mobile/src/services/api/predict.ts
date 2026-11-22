import type {
  MortalityPredictRequest,
  MortalityPredictResponse,
} from '@/types/api';
import type { MortalityFormState } from '@/types/clinical';
import { parseLocaleNumber } from '@/utils/validation';
import { postJson, type PostJsonOptions } from './client';

function requirePositiveField(raw: string, fieldName: string): number {
  const parsed = parseLocaleNumber(raw);
  if (parsed === null || parsed <= 0) {
    throw new Error(`Invalid positive numeric value for "${fieldName}".`);
  }
  return parsed;
}

export function buildMortalityPayload(
  form: MortalityFormState
): MortalityPredictRequest {
  return {
    komor_sepsis: form.komor_sepsis,
    urea_baseline: requirePositiveField(form.urea_baseline, 'urea_baseline'),
    natrium_baseline: requirePositiveField(
      form.natrium_baseline,
      'natrium_baseline'
    ),
    komp_eh: form.komp_eh,
    inr_baseline: requirePositiveField(form.inr_baseline, 'inr_baseline'),
    sgot_baseline: requirePositiveField(form.sgot_baseline, 'sgot_baseline'),
    gfr: requirePositiveField(form.gfr, 'gfr'),
    ctp_encoded: form.ctp_encoded,
  };
}

export async function predictMortality(
  payload: MortalityPredictRequest,
  options?: PostJsonOptions
): Promise<MortalityPredictResponse> {
  return postJson<MortalityPredictRequest, MortalityPredictResponse>(
    '/api/predict',
    payload,
    options
  );
}
