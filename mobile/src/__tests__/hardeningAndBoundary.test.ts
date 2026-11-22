import {
  buildDosePayload,
  buildMortalitySavePayload,
} from '@/services/api';
import type { DoseFormState, DrugId } from '@/types/clinical';
import {
  hitungGfrCkdEpi,
  hitungInr,
  hitungMap,
  hitungMeldUnos,
  hitungSkorCtp,
} from '@/utils/clinical';
import { parseLocaleNumber } from '@/utils/validation';

const appConfig = require('../../app.json');
const easConfig = require('../../eas.json');

function makeEmptyDrugSelection(): Record<DrugId, boolean> {
  return {
    spiro_furo: false,
    spironolakton: false,
    furosemid: false,
    propranolol: false,
    carvedilol: false,
    ampisilin_sulbaktam: false,
    azitromisin: false,
    levofloxacin: false,
  };
}

describe('Phase 6 Hardening: Boundary Math, Payloads, and Build Configuration', () => {
  it('enforces exact CTP boundaries across scores 5, 6, 7, 9, 10, and 15', () => {
    expect(
      hitungSkorCtp({
        bilirubin: '1',
        albumin: '1',
        inr: '1',
        ascites: '1',
        encephalopathy: '1',
      })
    ).toEqual({ total: 5, kelas: 'A', encoded: 1 });

    expect(
      hitungSkorCtp({
        bilirubin: '2',
        albumin: '1',
        inr: '1',
        ascites: '1',
        encephalopathy: '1',
      })
    ).toEqual({ total: 6, kelas: 'A', encoded: 1 });

    expect(
      hitungSkorCtp({
        bilirubin: '2',
        albumin: '2',
        inr: '1',
        ascites: '1',
        encephalopathy: '1',
      })
    ).toEqual({ total: 7, kelas: 'B', encoded: 2 });

    expect(
      hitungSkorCtp({
        bilirubin: '2',
        albumin: '2',
        inr: '2',
        ascites: '2',
        encephalopathy: '1',
      })
    ).toEqual({ total: 9, kelas: 'B', encoded: 2 });

    expect(
      hitungSkorCtp({
        bilirubin: '2',
        albumin: '2',
        inr: '2',
        ascites: '2',
        encephalopathy: '2',
      })
    ).toEqual({ total: 10, kelas: 'C', encoded: 3 });

    expect(
      hitungSkorCtp({
        bilirubin: '3',
        albumin: '3',
        inr: '3',
        ascites: '3',
        encephalopathy: '3',
      })
    ).toEqual({ total: 15, kelas: 'C', encoded: 3 });
  });

  it('guards non-positive/non-finite inputs and UNOS 1.0 floor + 4.0 Cr cap accurately', () => {
    expect(hitungMeldUnos(0.2, 0.7, 0.4)).toBe('6.4');
    expect(hitungMeldUnos(2.0, 1.5, 4.0)).toBe(hitungMeldUnos(2.0, 1.5, 9.2));
    expect(hitungMeldUnos(0, 1.2, 1.1)).toBeNull();
    expect(hitungMeldUnos(1.2, -1, 1.1)).toBeNull();
    expect(hitungMeldUnos(1.2, 1.2, Number.POSITIVE_INFINITY)).toBeNull();

    expect(hitungGfrCkdEpi(0, 50, 'L')).toBeNull();
    expect(hitungGfrCkdEpi(-1.2, 50, 'P')).toBeNull();
    expect(hitungGfrCkdEpi(1.0, Number.NaN, 'L')).toBeNull();

    expect(hitungInr(0, 12, 1)).toBeNull();
    expect(hitungInr(15, 0, 1)).toBeNull();
    expect(hitungInr(15, 12, -1)).toBeNull();

    expect(hitungMap(0, 80)).toBeNull();
    expect(hitungMap(120, -10)).toBeNull();
  });

  it('normalizes Indonesian comma decimals safely under whitespace and rejects ambiguous strings', () => {
    expect(parseLocaleNumber('  1,25  ')).toBe(1.25);
    expect(parseLocaleNumber('85.5')).toBe(85.5);
    expect(parseLocaleNumber('1,2,3')).toBeNull();
    expect(parseLocaleNumber('1.2,3')).toBeNull();
    expect(parseLocaleNumber('abc')).toBeNull();
  });

  it('maps the complete (isCKD, isAKI) truth table into gagal_ginjal_akut', () => {
    const base: DoseFormState = {
      gfr: '45,5',
      ctp: 'B',
      map_value: '',
      ascites_refrakter: 0,
      hrs: 0,
      sepsis_pneumonia: 0,
      ast_alt_tinggi: 0,
      isCKD: false,
      isAKI: false,
      obat_pilihan: makeEmptyDrugSelection(),
    };

    expect(buildDosePayload({ ...base, isCKD: false, isAKI: false }).gagal_ginjal_akut).toBe(0);
    expect(buildDosePayload({ ...base, isCKD: true, isAKI: false }).gagal_ginjal_akut).toBe(1);
    expect(buildDosePayload({ ...base, isCKD: false, isAKI: true }).gagal_ginjal_akut).toBe(1);
    expect(buildDosePayload({ ...base, isCKD: true, isAKI: true }).gagal_ginjal_akut).toBe(1);
  });

  it('guarantees non-null shap_contributions array on Mortality save payloads', () => {
    const payload = buildMortalitySavePayload({
      input: {
        komor_sepsis: 1,
        urea_baseline: 90,
        natrium_baseline: 132,
        komp_eh: 0,
        inr_baseline: 1.4,
        sgot_baseline: 80,
        gfr: 35,
        ctp_encoded: 2,
      },
      result: {
        probability: 0.72,
        predicted_class: 1,
        base_value: 0.24,
        shap_contributions: null as never,
      },
      token: '  secret-token  ',
    });

    expect(payload.shap_contributions).toEqual([]);
    expect(payload.token).toBe('secret-token');
  });

  it('ships valid Android adaptive & EAS release configuration', () => {
    expect(appConfig.expo.orientation).toBe('default');
    expect(appConfig.expo.userInterfaceStyle).toBe('automatic');
    expect(appConfig.expo.platforms).toEqual(['android']);
    expect(appConfig.expo.android.package).toBe('com.cirrhosmart.ai');
    expect(appConfig.expo.android.predictiveBackGestureEnabled).toBe(true);
    expect(appConfig.expo.android.softwareKeyboardLayoutMode).toBe('resize');
    expect(appConfig.expo.android.adaptiveIcon.backgroundColor).toBe('#7F1D1D');

    expect(easConfig.build.development.developmentClient).toBe(true);
    expect(easConfig.build.preview.distribution).toBe('internal');
    expect(easConfig.build.preview.android.buildType).toBe('apk');
    expect(easConfig.build.production.android.buildType).toBe('app-bundle');
  });
});
