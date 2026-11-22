import type {
  DoseFormState,
  LosFormState,
  MortalityFormState,
} from '@/types/clinical';
import {
  parseLocaleNumber,
  validateDoseForm,
  validateLosForm,
  validateMortalityForm,
  validateOptionalPositiveNumber,
  validatePositiveNumber,
  validateSaveToken,
} from '../validation';

describe('validation utilities', () => {
  describe('parseLocaleNumber', () => {
    it('parses dot and Indonesian comma decimals cleanly', () => {
      expect(parseLocaleNumber('25.5')).toBe(25.5);
      expect(parseLocaleNumber('25,5')).toBe(25.5);
      expect(parseLocaleNumber('  138  ')).toBe(138);
      expect(parseLocaleNumber('-4,25')).toBe(-4.25);
    });

    it('rejects empty, malformed, and multi-separator inputs', () => {
      expect(parseLocaleNumber('')).toBeNull();
      expect(parseLocaleNumber('   ')).toBeNull();
      expect(parseLocaleNumber('abc')).toBeNull();
      expect(parseLocaleNumber('1,2,3')).toBeNull();
      expect(parseLocaleNumber('1.2.3')).toBeNull();
      expect(parseLocaleNumber('12mg')).toBeNull();
    });
  });

  describe('number field validators', () => {
    it('validates required positive and optional positive numbers', () => {
      expect(validatePositiveNumber('')).toBe('validation.required');
      expect(validatePositiveNumber('abc')).toBe('validation.invalidNumber');
      expect(validatePositiveNumber('0')).toBe('validation.mustBePositive');
      expect(validatePositiveNumber('-2,5')).toBe('validation.mustBePositive');
      expect(validatePositiveNumber('2,5')).toBeNull();

      expect(validateOptionalPositiveNumber('')).toBeNull();
      expect(validateOptionalPositiveNumber('0')).toBe(
        'validation.mustBePositive'
      );
      expect(validateOptionalPositiveNumber('80,5')).toBeNull();
    });
  });

  describe('form validators', () => {
    it('validates MortalityFormState completely', () => {
      const invalidForm: MortalityFormState = {
        komor_sepsis: 0,
        urea_baseline: '',
        natrium_baseline: 'abc',
        komp_eh: 0,
        inr_baseline: '0',
        sgot_baseline: '45,5',
        gfr: '85',
        ctp_encoded: 1,
      };
      expect(validateMortalityForm(invalidForm)).toEqual({
        valid: false,
        errors: {
          urea_baseline: 'validation.required',
          natrium_baseline: 'validation.invalidNumber',
          inr_baseline: 'validation.mustBePositive',
        },
      });

      const validForm: MortalityFormState = {
        ...invalidForm,
        urea_baseline: '25,5',
        natrium_baseline: '138',
        inr_baseline: '1,2',
      };
      expect(validateMortalityForm(validForm)).toEqual({
        valid: true,
        errors: {},
      });
    });

    it('validates LosFormState completely', () => {
      const form: LosFormState = {
        komor_sepsis: 1,
        komp_eh: 0,
        ctp_encoded: 2,
        bilirubin_baseline: '1,5',
        kreatinin_baseline: '1.1',
        inr_baseline: '1.2',
        sgot_baseline: '50',
        usia: '55',
        gfr: '70',
        jk: 'L',
      };
      expect(validateLosForm(form)).toEqual({ valid: true, errors: {} });
      expect(validateLosForm({ ...form, usia: '' })).toEqual({
        valid: false,
        errors: { usia: 'validation.required' },
      });
    });

    it('validates DoseFormState including optional MAP and drug selection', () => {
      const baseForm: DoseFormState = {
        gfr: '60',
        ctp: 'B',
        map_value: '',
        ascites_refrakter: 0,
        hrs: 0,
        sepsis_pneumonia: 0,
        ast_alt_tinggi: 0,
        isCKD: false,
        isAKI: false,
        obat_pilihan: {
          spiro_furo: false,
          spironolakton: false,
          furosemid: false,
          propranolol: false,
          carvedilol: false,
          ampisilin_sulbaktam: false,
          azitromisin: false,
          levofloxacin: false,
        },
      };

      expect(validateDoseForm(baseForm)).toEqual({
        valid: false,
        errors: { obat_pilihan: 'validation.selectAtLeastOneDrug' },
      });

      expect(
        validateDoseForm({
          ...baseForm,
          map_value: 'bad',
          obat_pilihan: { ...baseForm.obat_pilihan, propranolol: true },
        })
      ).toEqual({
        valid: false,
        errors: { map_value: 'validation.invalidNumber' },
      });

      expect(
        validateDoseForm({
          ...baseForm,
          map_value: '72,5',
          obat_pilihan: { ...baseForm.obat_pilihan, propranolol: true },
        })
      ).toEqual({ valid: true, errors: {} });
    });

    it('validates save authorization token presence', () => {
      expect(validateSaveToken('')).toBe('validation.required');
      expect(validateSaveToken('   ')).toBe('validation.required');
      expect(validateSaveToken('secret-token')).toBeNull();
    });
  });
});
