import type { DosePredictRequest, DosePredictResponse } from '@/types/api';
import type { DoseFormState, DrugId } from '@/types/clinical';
import { parseLocaleNumber } from '@/utils/validation';
import { postJson, type PostJsonOptions } from './client';

export function buildDosePayload(form: DoseFormState): DosePredictRequest {
  const gfr = parseLocaleNumber(form.gfr);
  if (gfr === null || gfr <= 0) {
    throw new Error('Invalid positive numeric value for "gfr".');
  }

  let mapValue: number | null = null;
  if (form.map_value.trim()) {
    const parsedMap = parseLocaleNumber(form.map_value);
    if (parsedMap === null || parsedMap <= 0) {
      throw new Error('Invalid positive numeric value for "map_value".');
    }
    mapValue = parsedMap;
  }

  const selectedDrugs = (
    Object.entries(form.obat_pilihan) as [DrugId, boolean][]
  )
    .filter(([, selected]) => selected)
    .map(([drugId]) => drugId);

  return {
    gfr,
    ctp: form.ctp,
    map_value: mapValue,
    ascites_refrakter: form.ascites_refrakter,
    hrs: form.hrs,
    gagal_ginjal_akut: form.isCKD || form.isAKI ? 1 : 0,
    sepsis_pneumonia: form.sepsis_pneumonia,
    ast_alt_tinggi: form.ast_alt_tinggi,
    obat_pilihan: selectedDrugs,
  };
}

export async function predictDose(
  payload: DosePredictRequest,
  options?: PostJsonOptions
): Promise<DosePredictResponse> {
  return postJson<DosePredictRequest, DosePredictResponse>(
    '/api/dosis',
    payload,
    options
  );
}
