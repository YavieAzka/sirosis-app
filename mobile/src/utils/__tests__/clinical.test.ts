import {
  ALL_DRUG_IDS,
  classifyDoseStatusTone,
  hitungGfrCkdEpi,
  hitungInr,
  hitungMap,
  hitungMeldUnos,
  hitungSkorCtp,
  shouldSyncEncephalopathyFlag,
} from '../clinical';

describe('clinical calculators', () => {
  describe('hitungSkorCtp', () => {
    it('returns null when any parameter is empty', () => {
      expect(
        hitungSkorCtp({
          bilirubin: '1',
          albumin: '1',
          inr: '1',
          ascites: '1',
          encephalopathy: '',
        })
      ).toBeNull();
    });

    it('classifies Class A (5-6), Class B (7-9), and Class C (10-15) with encoded values', () => {
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
  });

  describe('shouldSyncEncephalopathyFlag', () => {
    it('returns 1 for grade 1-2 or 3-4 encephalopathy and 0 otherwise', () => {
      expect(shouldSyncEncephalopathyFlag('')).toBe(0);
      expect(shouldSyncEncephalopathyFlag('1')).toBe(0);
      expect(shouldSyncEncephalopathyFlag('2')).toBe(1);
      expect(shouldSyncEncephalopathyFlag('3')).toBe(1);
    });
  });

  describe('hitungGfrCkdEpi', () => {
    it('matches CKD-EPI 2021 race-free formula for male and female patients', () => {
      expect(hitungGfrCkdEpi(1.1, 45, 'L')).toBe('84.37');
      expect(hitungGfrCkdEpi(0.6, 50, 'P')).toBe('109.28');
      expect(hitungGfrCkdEpi(1.5, 65, 'P')).toBe('38.43');
    });

    it('returns null for non-positive or non-finite inputs', () => {
      expect(hitungGfrCkdEpi(0, 45, 'L')).toBeNull();
      expect(hitungGfrCkdEpi(1.1, 0, 'L')).toBeNull();
      expect(hitungGfrCkdEpi(-1, 45, 'P')).toBeNull();
      expect(hitungGfrCkdEpi(Number.NaN, 45, 'L')).toBeNull();
    });
  });

  describe('hitungInr', () => {
    it('computes (PT_patient / PT_normal)^ISI rounded to 2 decimals', () => {
      expect(hitungInr(14.5, 12.0, 1.0)).toBe('1.21');
      expect(hitungInr(18.0, 12.0, 1.2)).toBe('1.63');
    });

    it('returns null when any input is <= 0 or invalid', () => {
      expect(hitungInr(14.5, 0, 1.0)).toBeNull();
      expect(hitungInr(0, 12.0, 1.0)).toBeNull();
      expect(hitungInr(14.5, 12.0, 0)).toBeNull();
    });
  });

  describe('hitungMap', () => {
    it('computes (SBP + 2 * DBP) / 3 rounded to 2 decimals', () => {
      expect(hitungMap(120, 80)).toBe('93.33');
      expect(hitungMap(90, 60)).toBe('70.00');
    });

    it('returns null for non-positive inputs', () => {
      expect(hitungMap(0, 80)).toBeNull();
      expect(hitungMap(120, -10)).toBeNull();
    });
  });

  describe('hitungMeldUnos', () => {
    it('applies UNOS 1.0 floor and 4.0 creatinine cap matching predict_los.py', () => {
      expect(hitungMeldUnos(0.5, 0.9, 0.7)).toBe('6.4');
      expect(hitungMeldUnos(2.0, 1.5, 8.0)).toBe(hitungMeldUnos(2.0, 1.5, 4.0));
      // Manuscript Section 3.4 patient: bil=0.4, inr=1.11, Cr=2.7 -> ~17.1
      expect(hitungMeldUnos(0.4, 1.11, 2.7)).toBe('17.1');
    });

    it('returns null for non-positive or non-finite inputs', () => {
      expect(hitungMeldUnos(0, 1.2, 1.1)).toBeNull();
      expect(hitungMeldUnos(1.2, 0, 1.1)).toBeNull();
      expect(hitungMeldUnos(1.2, 1.1, -0.5)).toBeNull();
    });
  });

  describe('dose metadata & status classification', () => {
    it('lists all 8 supported drug IDs', () => {
      expect(ALL_DRUG_IDS).toHaveLength(8);
    });

    it('maps backend recommendation statuses to clinical semantic tones', () => {
      expect(classifyDoseStatusTone('Avoid')).toBe('danger');
      expect(classifyDoseStatusTone('Avoid / Paracentesis')).toBe('danger');
      expect(classifyDoseStatusTone('Hindari')).toBe('danger');
      expect(classifyDoseStatusTone('Monitor/Reduce')).toBe('warning');
      expect(classifyDoseStatusTone('Reduce (25-50%)')).toBe('warning');
      expect(classifyDoseStatusTone('Use (Dosis Standar)')).toBe('safe');
      expect(classifyDoseStatusTone('N/A')).toBe('neutral');
      expect(classifyDoseStatusTone('Belum Tersedia')).toBe('neutral');
    });
  });
});
