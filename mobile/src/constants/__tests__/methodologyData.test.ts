import {
  COHORT_CHARACTERISTICS,
  CONCORDANCE_CASES,
  DOSE_APPROPRIATENESS_DATA,
  MODEL_METRICS_TABLE,
  SCIENTIFIC_REFERENCES,
  filterScientificReferences,
} from '../methodologyData';

describe('methodology static datasets & reference filtering', () => {
  it('contains expected manuscript datasets', () => {
    expect(COHORT_CHARACTERISTICS).toHaveLength(4);
    expect(MODEL_METRICS_TABLE.length).toBeGreaterThanOrEqual(10);
    expect(DOSE_APPROPRIATENESS_DATA).toHaveLength(11);
    expect(CONCORDANCE_CASES).toHaveLength(19);
    expect(SCIENTIFIC_REFERENCES).toHaveLength(44);
    expect(new Set(SCIENTIFIC_REFERENCES.map((r) => r.id)).size).toBe(44);
  });

  it('filters scientific references by category and search query', () => {
    const guidelines = filterScientificReferences(
      SCIENTIFIC_REFERENCES,
      '',
      'guideline'
    );
    expect(guidelines.length).toBe(3);

    const aasldByDoi = filterScientificReferences(
      SCIENTIFIC_REFERENCES,
      '10.1002/hep.31884',
      'all'
    );
    expect(aasldByDoi).toHaveLength(1);
    expect(aasldByDoi[0].id).toBe(1);

    const caseInsensitive = filterScientificReferences(
      SCIENTIFIC_REFERENCES,
      '  care-cirrhosis ',
      'ml_ai'
    );
    expect(caseInsensitive).toHaveLength(1);
    expect(caseInsensitive[0].id).toBe(26);
  });
});
