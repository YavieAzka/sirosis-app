import type {
  DoseFormState,
  LosFormState,
  MortalityFormState,
} from '@/types/clinical';

export type FieldValidationCode =
  | 'validation.required'
  | 'validation.invalidNumber'
  | 'validation.mustBePositive'
  | 'validation.selectAtLeastOneDrug';

const STRICT_DECIMAL_PATTERN = /^-?\d+(?:[.,]\d+)?$/;

export function parseLocaleNumber(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed || !STRICT_DECIMAL_PATTERN.test(trimmed)) {
    return null;
  }
  const normalized = trimmed.replace(',', '.');
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed;
}

export function validatePositiveNumber(
  raw: string
): FieldValidationCode | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return 'validation.required';
  }
  const parsed = parseLocaleNumber(trimmed);
  if (parsed === null) {
    return 'validation.invalidNumber';
  }
  if (parsed <= 0) {
    return 'validation.mustBePositive';
  }
  return null;
}

export function validateOptionalPositiveNumber(
  raw: string
): FieldValidationCode | null {
  if (!raw.trim()) {
    return null;
  }
  return validatePositiveNumber(raw);
}

export type MortalityFieldErrors = Partial<
  Record<
    | 'urea_baseline'
    | 'natrium_baseline'
    | 'inr_baseline'
    | 'sgot_baseline'
    | 'gfr',
    FieldValidationCode
  >
>;

export function validateMortalityForm(form: MortalityFormState): {
  valid: boolean;
  errors: MortalityFieldErrors;
} {
  const errors: MortalityFieldErrors = {};
  const requiredFields: (keyof MortalityFieldErrors)[] = [
    'urea_baseline',
    'natrium_baseline',
    'inr_baseline',
    'sgot_baseline',
    'gfr',
  ];

  for (const field of requiredFields) {
    const err = validatePositiveNumber(form[field]);
    if (err) errors[field] = err;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export type LosFieldErrors = Partial<
  Record<
    | 'usia'
    | 'kreatinin_baseline'
    | 'bilirubin_baseline'
    | 'inr_baseline'
    | 'sgot_baseline'
    | 'gfr',
    FieldValidationCode
  >
>;

export function validateLosForm(form: LosFormState): {
  valid: boolean;
  errors: LosFieldErrors;
} {
  const errors: LosFieldErrors = {};
  const requiredFields: (keyof LosFieldErrors)[] = [
    'usia',
    'kreatinin_baseline',
    'bilirubin_baseline',
    'inr_baseline',
    'sgot_baseline',
    'gfr',
  ];

  for (const field of requiredFields) {
    const err = validatePositiveNumber(form[field]);
    if (err) errors[field] = err;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export type DoseFieldErrors = Partial<
  Record<'gfr' | 'map_value' | 'obat_pilihan', FieldValidationCode>
>;

export function validateDoseForm(form: DoseFormState): {
  valid: boolean;
  errors: DoseFieldErrors;
} {
  const errors: DoseFieldErrors = {};
  const gfrErr = validatePositiveNumber(form.gfr);
  if (gfrErr) errors.gfr = gfrErr;

  const mapErr = validateOptionalPositiveNumber(form.map_value);
  if (mapErr) errors.map_value = mapErr;

  const hasDrug = Object.values(form.obat_pilihan).some(Boolean);
  if (!hasDrug) {
    errors.obat_pilihan = 'validation.selectAtLeastOneDrug';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateSaveToken(token: string): FieldValidationCode | null {
  return token.trim().length > 0 ? null : 'validation.required';
}
