import React, { useCallback, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { Hospital, RotateCcw } from 'lucide-react-native';

import {
  CtpCalculator,
  GfrCalculatorCard,
  MeldScoreCard,
  ResultSheetModal,
} from '@/components/clinical';
import { ResponsiveWorkspace } from '@/components/navigation/ResponsiveWorkspace';
import {
  ClinicalButton,
  ClinicalCard,
  ClinicalNumberInput,
  InlineAlert,
  SegmentedToggle,
} from '@/components/ui';
import { useWindowSizeClass } from '@/hooks/useWindowSizeClass';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import { buildLosPayload, predictLos } from '@/services/api';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { LosPredictRequest, LosPredictResponse } from '@/types/api';
import type {
  BinaryFlag,
  CtpParamKey,
  CtpParams,
  CtpScoreValue,
  Gender,
  LosFormState,
} from '@/types/clinical';
import { getApiErrorMessage } from '@/utils/apiErrors';
import {
  hitungMeldUnos,
  hitungSkorCtp,
  shouldSyncEncephalopathyFlag,
} from '@/utils/clinical';
import { triggerErrorHaptic, triggerSuccessHaptic } from '@/utils/haptics';
import {
  parseLocaleNumber,
  validateLosForm,
  type LosFieldErrors,
} from '@/utils/validation';
import { LosResultPanel } from './LosResultPanel';

export function LosScreenContent() {
  const { theme } = useAppTheme();
  const { t } = useAppLanguage();
  const { isWide } = useWindowSizeClass();
  const { colors, typography, spacing } = theme;

  const [form, setForm] = useState<LosFormState>({
    komor_sepsis: 0,
    komp_eh: 0,
    ctp_encoded: 1,
    bilirubin_baseline: '',
    kreatinin_baseline: '',
    inr_baseline: '',
    sgot_baseline: '',
    usia: '',
    gfr: '',
    jk: 'L',
  });

  const [autoCtp, setAutoCtp] = useState(false);
  const [ctpParams, setCtpParams] = useState<CtpParams>({
    bilirubin: '',
    albumin: '',
    inr: '',
    ascites: '',
    encephalopathy: '',
  });

  const [fieldErrors, setFieldErrors] = useState<LosFieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LosPredictResponse | null>(null);
  const [submittedInput, setSubmittedInput] =
    useState<LosPredictRequest | null>(null);
  const [submittedGender, setSubmittedGender] = useState<Gender>('L');
  const [submittedMeld, setSubmittedMeld] = useState<string | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const syncAutoCtpToForm = useCallback(
    (params: CtpParams, isActive: boolean) => {
      if (!isActive) return;
      const calculated = hitungSkorCtp(params);
      const syncedEh = shouldSyncEncephalopathyFlag(params.encephalopathy);
      setForm((prev) => {
        const nextEncoded = calculated?.encoded ?? prev.ctp_encoded;
        if (prev.ctp_encoded === nextEncoded && prev.komp_eh === syncedEh) {
          return prev;
        }
        return {
          ...prev,
          ctp_encoded: nextEncoded,
          komp_eh: syncedEh,
        };
      });
    },
    []
  );

  const handleToggleAutoCtp = useCallback(
    (nextActive: boolean) => {
      setAutoCtp(nextActive);
      syncAutoCtpToForm(ctpParams, nextActive);
    },
    [ctpParams, syncAutoCtpToForm]
  );

  const handleCtpParamChange = (key: CtpParamKey, value: CtpScoreValue) => {
    const nextParams = { ...ctpParams, [key]: value };
    setCtpParams(nextParams);
    syncAutoCtpToForm(nextParams, autoCtp);
  };

  const handleGfrChange = useCallback((gfr: string) => {
    setForm((prev) => ({ ...prev, gfr }));
    setFieldErrors((prev) => (prev.gfr ? { ...prev, gfr: undefined } : prev));
  }, []);

  const handleGenderChange = useCallback((jk: Gender) => {
    setForm((prev) => ({ ...prev, jk }));
  }, []);

  const sepsisOptions = useMemo(
    () => [
      { value: 0 as BinaryFlag, label: t('common.no') },
      { value: 1 as BinaryFlag, label: t('los.sepsisYes') },
    ],
    [t]
  );

  const ehOptions = useMemo(
    () => [
      { value: 0 as BinaryFlag, label: t('common.no') },
      { value: 1 as BinaryFlag, label: t('common.yes') },
    ],
    [t]
  );

  const handleAnalyze = async () => {
    const validation = validateLosForm(form);
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      setApiError(null);
      await triggerErrorHaptic();
      return;
    }

    setFieldErrors({});
    setApiError(null);
    setLoading(true);

    try {
      const payload = buildLosPayload(form);
      const response = await predictLos(payload);
      const bil = parseLocaleNumber(form.bilirubin_baseline) ?? 1;
      const inr = parseLocaleNumber(form.inr_baseline) ?? 1;
      const cr = parseLocaleNumber(form.kreatinin_baseline) ?? 1;
      const meld = hitungMeldUnos(bil, inr, cr);

      setSubmittedInput(payload);
      setSubmittedGender(form.jk);
      setSubmittedMeld(meld);
      setResult(response);
      if (!isWide) {
        setSheetVisible(true);
      }
      await triggerSuccessHaptic();
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error, t));
      await triggerErrorHaptic();
    } finally {
      setLoading(false);
    }
  };

  const updateNumericField = (
    field:
      | 'usia'
      | 'kreatinin_baseline'
      | 'bilirubin_baseline'
      | 'inr_baseline'
      | 'sgot_baseline',
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const formPane = (
    <View style={{ gap: spacing.md }}>
      <ClinicalCard tone="elevated">
        <Text style={[typography.headlineSmall, { color: colors.primary }]}>
          {t('los.title')}
        </Text>

        <SegmentedToggle<BinaryFlag>
          testID="los-sepsis-toggle"
          label={t('los.sepsisStatus')}
          value={form.komor_sepsis}
          options={sepsisOptions}
          onChange={(val) => setForm((prev) => ({ ...prev, komor_sepsis: val }))}
        />

        <SegmentedToggle<BinaryFlag>
          testID="los-eh-toggle"
          label={t('los.encephalopathy')}
          value={form.komp_eh}
          options={ehOptions}
          onChange={(val) => setForm((prev) => ({ ...prev, komp_eh: val }))}
        />
      </ClinicalCard>

      <CtpCalculator
        testIDPrefix="los-ctp"
        active={autoCtp}
        onToggleActive={handleToggleAutoCtp}
        params={ctpParams}
        onChangeParam={handleCtpParamChange}
        manualEncoded={form.ctp_encoded}
        onChangeManualEncoded={(encoded) =>
          setForm((prev) => ({ ...prev, ctp_encoded: encoded }))
        }
      />

      <ClinicalCard>
        <ClinicalNumberInput
          testID="los-usia-input"
          label={t('los.ageYears')}
          placeholder={t('los.agePlaceholder')}
          unit={t('los.ageYears').includes('Tahun') ? 'thn' : 'yrs'}
          value={form.usia}
          error={fieldErrors.usia ? t(fieldErrors.usia) : null}
          onChangeText={(text) => updateNumericField('usia', text)}
        />

        <ClinicalNumberInput
          testID="los-kreatinin-input"
          label={t('los.creatinineBaseline')}
          placeholder={t('los.creatininePlaceholder')}
          unit="mg/dL"
          value={form.kreatinin_baseline}
          error={
            fieldErrors.kreatinin_baseline
              ? t(fieldErrors.kreatinin_baseline)
              : null
          }
          onChangeText={(text) => updateNumericField('kreatinin_baseline', text)}
        />

        <ClinicalNumberInput
          testID="los-bilirubin-input"
          label={t('los.bilirubinBaseline')}
          placeholder={t('los.bilirubinPlaceholder')}
          unit="mg/dL"
          value={form.bilirubin_baseline}
          error={
            fieldErrors.bilirubin_baseline
              ? t(fieldErrors.bilirubin_baseline)
              : null
          }
          onChangeText={(text) => updateNumericField('bilirubin_baseline', text)}
        />

        <ClinicalNumberInput
          testID="los-inr-input"
          label={t('los.inrBaseline')}
          placeholder={t('los.inrPlaceholder')}
          value={form.inr_baseline}
          error={fieldErrors.inr_baseline ? t(fieldErrors.inr_baseline) : null}
          onChangeText={(text) => updateNumericField('inr_baseline', text)}
        />

        <ClinicalNumberInput
          testID="los-sgot-input"
          label={t('los.sgotBaseline')}
          placeholder={t('los.sgotPlaceholder')}
          unit="U/L"
          value={form.sgot_baseline}
          error={fieldErrors.sgot_baseline ? t(fieldErrors.sgot_baseline) : null}
          onChangeText={(text) => updateNumericField('sgot_baseline', text)}
        />
      </ClinicalCard>

      <GfrCalculatorCard
        testIDPrefix="los-gfr"
        mode="linked"
        value={form.gfr}
        onChangeValue={handleGfrChange}
        gender={form.jk}
        onChangeGender={handleGenderChange}
        linkedScr={form.kreatinin_baseline}
        linkedAge={form.usia}
        error={fieldErrors.gfr ? t(fieldErrors.gfr) : null}
      />

      <MeldScoreCard
        testID="los-meld-card"
        bilirubin={form.bilirubin_baseline}
        inr={form.inr_baseline}
        creatinine={form.kreatinin_baseline}
      />

      {apiError && (
        <InlineAlert
          testID="los-api-error"
          tone="danger"
          message={apiError}
          action={
            <ClinicalButton
              testID="los-retry-btn"
              variant="outlined"
              icon={RotateCcw}
              label={t('common.retry')}
              onPress={() => {
                void handleAnalyze();
              }}
            />
          }
        />
      )}

      <ClinicalButton
        testID="los-submit-btn"
        icon={Hospital}
        label={loading ? t('common.calculating') : t('los.btnAnalyze')}
        loading={loading}
        onPress={() => {
          void handleAnalyze();
        }}
      />
    </View>
  );

  return (
    <>
      <ResponsiveWorkspace
        primaryPane={formPane}
        secondaryPane={
          isWide ? (
            <LosResultPanel
              result={result}
              submittedInput={submittedInput}
              submittedGender={submittedGender}
              meldScore={submittedMeld}
              testIDPrefix="los-result"
            />
          ) : undefined
        }
      />

      {!isWide && (
        <ResultSheetModal
          testID="los-result-modal"
          visible={sheetVisible && result !== null}
          title={t('los.modal.title')}
          onClose={() => setSheetVisible(false)}
        >
          <LosResultPanel
            result={result}
            submittedInput={submittedInput}
            submittedGender={submittedGender}
            meldScore={submittedMeld}
            testIDPrefix="los-result"
          />
        </ResultSheetModal>
      )}
    </>
  );
}
