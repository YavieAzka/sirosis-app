import type { LosPredictRequest, LosPredictResponse } from '@/types/api';
import type { LosFormState } from '@/types/clinical';
import { parseLocaleNumber } from '@/utils/validation';
import { postJson, type PostJsonOptions } from './client';

function requirePositiveField(raw: string, fieldName: string): number {
  const parsed = parseLocaleNumber(raw);
  if (parsed === null || parsed <= 0) {
    throw new Error(`Invalid positive numeric value for "${fieldName}".`);
  }
  return parsed;
}

export function buildLosPayload(form: LosFormState): LosPredictRequest {
  return {
    komor_sepsis: form.komor_sepsis,
    komp_eh: form.komp_eh,
    ctp_encoded: form.ctp_encoded,
    bilirubin_baseline: requirePositiveField(
      form.bilirubin_baseline,
      'bilirubin_baseline'
    ),
    kreatinin_baseline: requirePositiveField(
      form.kreatinin_baseline,
      'kreatinin_baseline'
    ),
    inr_baseline: requirePositiveField(form.inr_baseline, 'inr_baseline'),
    sgot_baseline: requirePositiveField(form.sgot_baseline, 'sgot_baseline'),
    usia: requirePositiveField(form.usia, 'usia'),
    gfr: requirePositiveField(form.gfr, 'gfr'),
  };
}

export async function predictLos(
  payload: LosPredictRequest,
  options?: PostJsonOptions
): Promise<LosPredictResponse> {
  return postJson<LosPredictRequest, LosPredictResponse>(
    '/api/predict_los',
    payload,
    options
  );
}
