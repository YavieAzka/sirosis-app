import NetInfo from '@react-native-community/netinfo';

import type {
  DoseFormState,
  LosFormState,
  MortalityFormState,
} from '@/types/clinical';
import { getApiBaseUrl } from '../config';
import { postJson } from '../client';
import {
  buildLosSavePayload,
  buildMortalitySavePayload,
  savePredictionToDatabase,
} from '../databaseSave';
import { buildDosePayload, predictDose } from '../dose';
import { ApiError, isApiError } from '../errors';
import { buildMortalityPayload, predictMortality } from '../predict';
import { buildLosPayload, predictLos } from '../predictLos';

describe('API config, HTTP client, and endpoint mappers', () => {
  const originalEnvUrl = process.env.EXPO_PUBLIC_API_URL;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = 'https://cirrhosmart.example.com/';
    jest
      .spyOn(NetInfo, 'fetch')
      .mockResolvedValue({ isConnected: true } as never);
  });

  afterEach(() => {
    process.env.EXPO_PUBLIC_API_URL = originalEnvUrl;
    globalThis.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  describe('getApiBaseUrl', () => {
    it('normalizes trailing slashes and rejects missing or invalid protocols', () => {
      expect(getApiBaseUrl()).toBe('https://cirrhosmart.example.com');

      process.env.EXPO_PUBLIC_API_URL = '';
      expect(() => getApiBaseUrl()).toThrow(ApiError);

      process.env.EXPO_PUBLIC_API_URL = 'ftp://invalid.example.com';
      try {
        getApiBaseUrl();
        fail('Expected CONFIG ApiError');
      } catch (err) {
        expect(isApiError(err)).toBe(true);
        expect((err as ApiError).code).toBe('CONFIG');
      }
    });
  });

  describe('postJson error and success handling', () => {
    it('throws OFFLINE immediately without calling fetch when disconnected', async () => {
      jest
        .spyOn(NetInfo, 'fetch')
        .mockResolvedValue({ isConnected: false } as never);
      const fetchMock = jest.fn();
      globalThis.fetch = fetchMock as never;

      await expect(postJson('/api/predict', { a: 1 })).rejects.toMatchObject({
        code: 'OFFLINE',
      });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('maps HTTP 401 to UNAUTHORIZED and HTTP 500 to SERVER', async () => {
      globalThis.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Invalid token' }),
      }) as never;

      await expect(postJson('/api/database/save', {})).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
        status: 401,
        message: 'Invalid token',
      });

      globalThis.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Joblib error' }),
      }) as never;

      await expect(postJson('/api/predict', {})).rejects.toMatchObject({
        code: 'SERVER',
        status: 500,
        message: 'Joblib error',
      });
    });

    it('maps invalid JSON response to PARSE error', async () => {
      globalThis.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError('Unexpected token');
        },
      }) as never;

      await expect(postJson('/api/predict', {})).rejects.toMatchObject({
        code: 'PARSE',
      });
    });

    it('maps AbortError to TIMEOUT and rejected fetch to NETWORK', async () => {
      const abortErr = new Error('Aborted');
      abortErr.name = 'AbortError';
      globalThis.fetch = jest.fn().mockRejectedValue(abortErr) as never;

      await expect(
        postJson('/api/predict', {}, { timeoutMs: 50 })
      ).rejects.toMatchObject({
        code: 'TIMEOUT',
      });

      globalThis.fetch = jest
        .fn()
        .mockRejectedValue(new Error('Network request failed')) as never;

      await expect(postJson('/api/predict', {})).rejects.toMatchObject({
        code: 'NETWORK',
      });
    });

    it('returns parsed response on 200 OK', async () => {
      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ probability_los: 0.42 }),
      });
      globalThis.fetch = fetchMock as never;

      const result = await postJson<{ x: number }, { probability_los: number }>(
        '/api/predict_los',
        { x: 1 }
      );
      expect(result).toEqual({ probability_los: 0.42 });
      expect(fetchMock).toHaveBeenCalledWith(
        'https://cirrhosmart.example.com/api/predict_los',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ x: 1 }),
        })
      );
    });
  });

  describe('payload builders and endpoint helpers', () => {
    it('builds Mortality payload with comma decimal normalization and calls /api/predict', async () => {
      const form: MortalityFormState = {
        komor_sepsis: 1,
        urea_baseline: '96,5',
        natrium_baseline: '136',
        komp_eh: 1,
        inr_baseline: '1,11',
        sgot_baseline: '70',
        gfr: '26,4',
        ctp_encoded: 2,
      };
      const payload = buildMortalityPayload(form);
      expect(payload).toEqual({
        komor_sepsis: 1,
        urea_baseline: 96.5,
        natrium_baseline: 136,
        komp_eh: 1,
        inr_baseline: 1.11,
        sgot_baseline: 70,
        gfr: 26.4,
        ctp_encoded: 2,
      });

      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          probability: 0.697,
          predicted_class: 1,
          base_value: 0.499,
          shap_contributions: [],
        }),
      });
      globalThis.fetch = fetchMock as never;
      await predictMortality(payload);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://cirrhosmart.example.com/api/predict',
        expect.anything()
      );
    });

    it('builds LoS payload without jk/meld_score and calls /api/predict_los', async () => {
      const form: LosFormState = {
        komor_sepsis: 0,
        komp_eh: 1,
        ctp_encoded: 3,
        bilirubin_baseline: '2,4',
        kreatinin_baseline: '1,8',
        inr_baseline: '1,5',
        sgot_baseline: '88',
        usia: '60',
        gfr: '41,2',
        jk: 'P',
      };
      const payload = buildLosPayload(form);
      expect(payload).toEqual({
        komor_sepsis: 0,
        komp_eh: 1,
        ctp_encoded: 3,
        bilirubin_baseline: 2.4,
        kreatinin_baseline: 1.8,
        inr_baseline: 1.5,
        sgot_baseline: 88,
        usia: 60,
        gfr: 41.2,
      });

      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ probability_los: 0.55 }),
      });
      globalThis.fetch = fetchMock as never;
      await predictLos(payload);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://cirrhosmart.example.com/api/predict_los',
        expect.anything()
      );
    });

    it('combines CKD and AKI into gagal_ginjal_akut and handles nullable MAP for /api/dosis', async () => {
      const baseForm: DoseFormState = {
        gfr: '48,5',
        ctp: 'B',
        map_value: '',
        ascites_refrakter: 0,
        hrs: 0,
        sepsis_pneumonia: 1,
        ast_alt_tinggi: 0,
        isCKD: true,
        isAKI: false,
        obat_pilihan: {
          spiro_furo: true,
          spironolakton: false,
          furosemid: false,
          propranolol: true,
          carvedilol: false,
          ampisilin_sulbaktam: false,
          azitromisin: false,
          levofloxacin: false,
        },
      };
      const payload = buildDosePayload(baseForm);
      expect(payload).toEqual({
        gfr: 48.5,
        ctp: 'B',
        map_value: null,
        ascites_refrakter: 0,
        hrs: 0,
        gagal_ginjal_akut: 1,
        sepsis_pneumonia: 1,
        ast_alt_tinggi: 0,
        obat_pilihan: ['spiro_furo', 'propranolol'],
      });

      const payloadWithoutRenal = buildDosePayload({
        ...baseForm,
        isCKD: false,
        isAKI: false,
        map_value: '64,2',
      });
      expect(payloadWithoutRenal.gagal_ginjal_akut).toBe(0);
      expect(payloadWithoutRenal.map_value).toBe(64.2);

      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({}),
      });
      globalThis.fetch = fetchMock as never;
      await predictDose(payload);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://cirrhosmart.example.com/api/dosis',
        expect.anything()
      );
    });

    it('builds safe DatabaseSave payloads ensuring non-null shap_contributions', async () => {
      const mortalitySave = buildMortalitySavePayload({
        input: {
          komor_sepsis: 0,
          urea_baseline: 30,
          natrium_baseline: 135,
          komp_eh: 0,
          inr_baseline: 1.2,
          sgot_baseline: 40,
          gfr: 80,
          ctp_encoded: 1,
        },
        result: {
          probability: 0.21,
          predicted_class: 0,
          base_value: 0.49,
          shap_contributions: undefined as never,
        },
        token: '  valid-token  ',
        patientName: '  Pasien Uji  ',
      });

      expect(mortalitySave.shap_contributions).toEqual([]);
      expect(mortalitySave.token).toBe('valid-token');
      expect(mortalitySave.nama_pasien).toBe('Pasien Uji');
      expect(mortalitySave.rekam_medis).toBeUndefined();

      const losSave = buildLosSavePayload({
        input: {
          komor_sepsis: 0,
          komp_eh: 0,
          ctp_encoded: 2,
          bilirubin_baseline: 1.5,
          kreatinin_baseline: 1.1,
          inr_baseline: 1.2,
          sgot_baseline: 45,
          usia: 50,
          gfr: 75,
        },
        gender: 'P',
        probabilityLos: 0.58,
        meldScore: 12.4,
        token: 'valid-token',
      });
      expect(losSave.meldScore).toBe(12.4);
      expect(losSave.probability_los).toBe(0.58);

      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: { patient: {}, mortality: {}, los: null },
        }),
      });
      globalThis.fetch = fetchMock as never;
      await savePredictionToDatabase(mortalitySave);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://cirrhosmart.example.com/api/database/save',
        expect.anything()
      );
    });
  });
});
