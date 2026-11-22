import React, { useCallback, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { HeartPulse, RotateCcw } from 'lucide-react-native';

import {
  CtpCalculator,
  GfrCalculatorCard,
  InrInputCard,
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
import { buildMortalityPayload, predictMortality } from '@/services/api';
import { useAppTheme } from '@/theme/ThemeProvider';
import type {
  MortalityPredictRequest,
  MortalityPredictResponse,
} from '@/types/api';
import type {
  BinaryFlag,
  CtpParamKey,
  CtpParams,
  CtpScoreValue,
  Gender,
  MortalityFormState,
} from '@/types/clinical';
import { getApiErrorMessage } from '@/utils/apiErrors';
import { hitungSkorCtp, shouldSyncEncephalopathyFlag } from '@/utils/clinical';
import { triggerErrorHaptic, triggerSuccessHaptic } from '@/utils/haptics';
import {
  validateMortalityForm,
  type MortalityFieldErrors,
} from '@/utils/validation';
import { MortalityResultPanel } from './MortalityResultPanel';

export function MortalityScreenContent() {
  const { theme } = useAppTheme();
  const { t } = useAppLanguage();
  const { isWide } = useWindowSizeClass();
  const { colors, typography, spacing } = theme;

  const [form, setForm] = useState<MortalityFormState>({
    komor_sepsis: 0,
    urea_baseline: '',
    natrium_baseline: '',
    komp_eh: 0,
    inr_baseline: '',
    sgot_baseline: '',
    gfr: '',
    ctp_encoded: 1,
  });

  const [autoCtp, setAutoCtp] = useState(false);
  const [ctpParams, setCtpParams] = useState<CtpParams>({
    bilirubin: '',
    albumin: '',
    inr: '',
    ascites: '',
    encephalopathy: '',
  });
  const [gfrGender, setGfrGender] = useState<Gender>('L');

  const [fieldErrors, setFieldErrors] = useState<MortalityFieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MortalityPredictResponse | null>(null);
  const [submittedInput, setSubmittedInput] =
    useState<MortalityPredictRequest | null>(null);
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

  const handleInrChange = useCallback((inr: string) => {
    setForm((prev) => ({ ...prev, inr_baseline: inr }));
    setFieldErrors((prev) =>
      prev.inr_baseline ? { ...prev, inr_baseline: undefined } : prev
    );
  }, []);

  const handleGfrChange = useCallback((gfr: string) => {
    setForm((prev) => ({ ...prev, gfr }));
    setFieldErrors((prev) => (prev.gfr ? { ...prev, gfr: undefined } : prev));
  }, []);

  const sepsisOptions = useMemo(
    () => [
      { value: 0 as BinaryFlag, label: t('common.no') },
      { value: 1 as BinaryFlag, label: t('mortality.sepsisYes') },
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
    const validation = validateMortalityForm(form);
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
      const payload = buildMortalityPayload(form);
      const response = await predictMortality(payload);
      setSubmittedInput(payload);
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

  const formPane = (
    <View style={{ gap: spacing.md }}>
      <ClinicalCard tone="elevated">
        <Text style={[typography.headlineSmall, { color: colors.primary }]}>
          {t('mortality.title')}
        </Text>

        <SegmentedToggle<BinaryFlag>
          testID="mortality-sepsis-toggle"
          label={t('mortality.sepsisStatus')}
          value={form.komor_sepsis}
          options={sepsisOptions}
          onChange={(val) => setForm((prev) => ({ ...prev, komor_sepsis: val }))}
        />

        <SegmentedToggle<BinaryFlag>
          testID="mortality-eh-toggle"
          label={t('mortality.encephalopathy')}
          value={form.komp_eh}
          options={ehOptions}
          onChange={(val) => setForm((prev) => ({ ...prev, komp_eh: val }))}
        />
      </ClinicalCard>

      <CtpCalculator
        testIDPrefix="mortality-ctp"
        active={autoCtp}
        onToggleActive={handleToggleAutoCtp}
        params={ctpParams}
        onChangeParam={handleCtpParamChange}
        manualEncoded={form.ctp_encoded}
        onChangeManualEncoded={(encoded) =>
          setForm((prev) => ({ ...prev, ctp_encoded: encoded }))
        }
      />

      <InrInputCard
        testIDPrefix="mortality-inr"
        value={form.inr_baseline}
        onChangeValue={handleInrChange}
        error={fieldErrors.inr_baseline ? t(fieldErrors.inr_baseline) : null}
      />

      <ClinicalCard>
        <ClinicalNumberInput
          testID="mortality-urea-input"
          label={t('mortality.ureaBaseline')}
          placeholder={t('mortality.ureaPlaceholder')}
          unit="mg/dL"
          value={form.urea_baseline}
          error={
            fieldErrors.urea_baseline ? t(fieldErrors.urea_baseline) : null
          }
          onChangeText={(text) => {
            setForm((prev) => ({ ...prev, urea_baseline: text }));
            if (fieldErrors.urea_baseline) {
              setFieldErrors((prev) => ({ ...prev, urea_baseline: undefined }));
            }
          }}
        />

        <ClinicalNumberInput
          testID="mortality-natrium-input"
          label={t('mortality.natriumBaseline')}
          placeholder={t('mortality.natriumPlaceholder')}
          unit="mEq/L"
          value={form.natrium_baseline}
          error={
            fieldErrors.natrium_baseline
              ? t(fieldErrors.natrium_baseline)
              : null
          }
          onChangeText={(text) => {
            setForm((prev) => ({ ...prev, natrium_baseline: text }));
            if (fieldErrors.natrium_baseline) {
              setFieldErrors((prev) => ({
                ...prev,
                natrium_baseline: undefined,
              }));
            }
          }}
        />

        <ClinicalNumberInput
          testID="mortality-sgot-input"
          label={t('mortality.sgotBaseline')}
          placeholder={t('mortality.sgotPlaceholder')}
          unit="U/L"
          value={form.sgot_baseline}
          error={
            fieldErrors.sgot_baseline ? t(fieldErrors.sgot_baseline) : null
          }
          onChangeText={(text) => {
            setForm((prev) => ({ ...prev, sgot_baseline: text }));
            if (fieldErrors.sgot_baseline) {
              setFieldErrors((prev) => ({ ...prev, sgot_baseline: undefined }));
            }
          }}
        />
      </ClinicalCard>

      <GfrCalculatorCard
        testIDPrefix="mortality-gfr"
        mode="standalone"
        value={form.gfr}
        onChangeValue={handleGfrChange}
        gender={gfrGender}
        onChangeGender={setGfrGender}
        error={fieldErrors.gfr ? t(fieldErrors.gfr) : null}
      />

      {apiError && (
        <InlineAlert
          testID="mortality-api-error"
          tone="danger"
          message={apiError}
          action={
            <ClinicalButton
              testID="mortality-retry-btn"
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
        testID="mortality-submit-btn"
        icon={HeartPulse}
        label={loading ? t('common.calculating') : t('mortality.btnAnalyze')}
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
            <MortalityResultPanel
              result={result}
              submittedInput={submittedInput}
              defaultExpandedShap
              testIDPrefix="mortality-result"
            />
          ) : undefined
        }
      />

      {!isWide && (
        <ResultSheetModal
          testID="mortality-result-modal"
          visible={sheetVisible && result !== null}
          title={t('mortality.modal.title')}
          onClose={() => setSheetVisible(false)}
        >
          <MortalityResultPanel
            result={result}
            submittedInput={submittedInput}
            testIDPrefix="mortality-result"
          />
        </ResultSheetModal>
      )}
    </>
  );
}
