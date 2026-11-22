import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckSquare, Pill, RotateCcw } from 'lucide-react-native';

import {
  CtpCalculator,
  GfrCalculatorCard,
  MapInputCard,
  ResultSheetModal,
} from '@/components/clinical';
import { ResponsiveWorkspace } from '@/components/navigation/ResponsiveWorkspace';
import {
  CheckboxRow,
  ClinicalButton,
  ClinicalCard,
  InlineAlert,
} from '@/components/ui';
import { useWindowSizeClass } from '@/hooks/useWindowSizeClass';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import { buildDosePayload, predictDose } from '@/services/api';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { DosePredictResponse } from '@/types/api';
import type {
  CtpClass,
  CtpEncoded,
  CtpParamKey,
  CtpParams,
  CtpScoreValue,
  DoseFormState,
  DrugId,
  Gender,
} from '@/types/clinical';
import { getApiErrorMessage } from '@/utils/apiErrors';
import { CTP_CLASS_TO_ENCODED, hitungSkorCtp } from '@/utils/clinical';
import { triggerErrorHaptic, triggerSuccessHaptic } from '@/utils/haptics';
import { validateDoseForm, type DoseFieldErrors } from '@/utils/validation';
import { DoseResultPanel } from './DoseResultPanel';

const ENCODED_TO_CTP_CLASS: Record<CtpEncoded, CtpClass> = {
  1: 'A',
  2: 'B',
  3: 'C',
};

export function DoseScreenContent() {
  const { theme } = useAppTheme();
  const { t } = useAppLanguage();
  const { isWide } = useWindowSizeClass();
  const { colors, typography, radii, spacing } = theme;

  const [form, setForm] = useState<DoseFormState>({
    gfr: '',
    ctp: 'A',
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

  const [fieldErrors, setFieldErrors] = useState<DoseFieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DosePredictResponse | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const syncAutoCtpToForm = useCallback(
    (params: CtpParams, isActive: boolean) => {
      if (!isActive) return;
      const calculated = hitungSkorCtp(params);
      if (!calculated) return;
      setForm((prev) =>
        prev.ctp === calculated.kelas
          ? prev
          : { ...prev, ctp: calculated.kelas }
      );
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

  const handleMapChange = useCallback((mapValue: string) => {
    setForm((prev) => ({ ...prev, map_value: mapValue }));
    setFieldErrors((prev) =>
      prev.map_value ? { ...prev, map_value: undefined } : prev
    );
  }, []);

  const toggleDrug = (drugId: DrugId) => {
    setForm((prev) => ({
      ...prev,
      obat_pilihan: {
        ...prev.obat_pilihan,
        [drugId]: !prev.obat_pilihan[drugId],
      },
    }));
    if (fieldErrors.obat_pilihan) {
      setFieldErrors((prev) => ({ ...prev, obat_pilihan: undefined }));
    }
  };

  const handleSelectAllDrugs = () => {
    setForm((prev) => ({
      ...prev,
      obat_pilihan: {
        spiro_furo: true,
        spironolakton: false,
        furosemid: false,
        propranolol: true,
        carvedilol: true,
        ampisilin_sulbaktam: true,
        azitromisin: true,
        levofloxacin: true,
      },
    }));
    if (fieldErrors.obat_pilihan) {
      setFieldErrors((prev) => ({ ...prev, obat_pilihan: undefined }));
    }
  };

  const toggleAcuteFlag = (
    key: 'ascites_refrakter' | 'hrs' | 'sepsis_pneumonia' | 'ast_alt_tinggi'
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key] === 1 ? 0 : 1,
    }));
  };

  const handleCheckRecommendation = async () => {
    const validation = validateDoseForm(form);
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
      const payload = buildDosePayload(form);
      const response = await predictDose(payload);
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

  const isSingleDiureticSelected =
    form.obat_pilihan.spironolakton || form.obat_pilihan.furosemid;
  const isComboDiureticSelected = form.obat_pilihan.spiro_furo;

  const formPane = (
    <View style={{ gap: spacing.md }}>
      <ClinicalCard tone="elevated">
        <View style={styles.drugHeader}>
          <View style={{ flex: 1, paddingRight: spacing.sm }}>
            <Text style={[typography.headlineSmall, { color: colors.primary }]}>
              {t('dose.title')}
            </Text>
            <Text
              style={[typography.bodySmall, { color: colors.onSurfaceVariant }]}
            >
              {t('dose.selectDrugs')}
            </Text>
          </View>
          <ClinicalButton
            testID="dose-select-all-btn"
            variant="tonal"
            icon={CheckSquare}
            label={t('dose.selectAll')}
            onPress={handleSelectAllDrugs}
          />
        </View>

        <View
          style={[
            styles.groupBox,
            {
              backgroundColor: colors.clinical.info.container,
              borderColor: colors.clinical.info.border,
              borderRadius: radii.md,
              padding: spacing.md,
              gap: spacing.xs,
            },
          ]}
        >
          <Text
            style={[
              typography.labelLarge,
              { color: colors.clinical.info.onContainer },
            ]}
          >
            {t('dose.diuretics')}
          </Text>
          <CheckboxRow
            testID="dose-drug-spiro_furo"
            label={t('dose.comboSpiroFuro')}
            checked={form.obat_pilihan.spiro_furo}
            disabled={isSingleDiureticSelected}
            onToggle={() => toggleDrug('spiro_furo')}
          />
          <CheckboxRow
            testID="dose-drug-spironolakton"
            label={t('dose.spiroSingle')}
            checked={form.obat_pilihan.spironolakton}
            disabled={isComboDiureticSelected}
            onToggle={() => toggleDrug('spironolakton')}
          />
          <CheckboxRow
            testID="dose-drug-furosemid"
            label={t('dose.furoSingle')}
            checked={form.obat_pilihan.furosemid}
            disabled={isComboDiureticSelected}
            onToggle={() => toggleDrug('furosemid')}
          />
          <Text
            style={[
              typography.bodySmall,
              { color: colors.clinical.info.onContainer },
            ]}
          >
            {t('dose.mutualExclusionHint')}
          </Text>
        </View>

        <View
          style={[
            styles.groupBox,
            {
              backgroundColor: colors.clinical.safe.container,
              borderColor: colors.clinical.safe.border,
              borderRadius: radii.md,
              padding: spacing.md,
              gap: spacing.xs,
            },
          ]}
        >
          <Text
            style={[
              typography.labelLarge,
              { color: colors.clinical.safe.onContainer },
            ]}
          >
            {t('dose.betaBlockers')}
          </Text>
          <CheckboxRow
            testID="dose-drug-propranolol"
            label={t('dose.propranolol')}
            checked={form.obat_pilihan.propranolol}
            onToggle={() => toggleDrug('propranolol')}
          />
          <CheckboxRow
            testID="dose-drug-carvedilol"
            label={t('dose.carvedilol')}
            checked={form.obat_pilihan.carvedilol}
            onToggle={() => toggleDrug('carvedilol')}
          />
        </View>

        <View
          style={[
            styles.groupBox,
            {
              backgroundColor: colors.clinical.danger.container,
              borderColor: colors.clinical.danger.border,
              borderRadius: radii.md,
              padding: spacing.md,
              gap: spacing.xs,
            },
          ]}
        >
          <Text
            style={[
              typography.labelLarge,
              { color: colors.clinical.danger.onContainer },
            ]}
          >
            {t('dose.antibioticsInfo')}
          </Text>
          <CheckboxRow
            testID="dose-drug-ampisilin_sulbaktam"
            label={t('dose.ampiSulbactam')}
            checked={form.obat_pilihan.ampisilin_sulbaktam}
            onToggle={() => toggleDrug('ampisilin_sulbaktam')}
          />
          <CheckboxRow
            testID="dose-drug-levofloxacin"
            label={t('dose.levofloxacin')}
            checked={form.obat_pilihan.levofloxacin}
            onToggle={() => toggleDrug('levofloxacin')}
          />
          <CheckboxRow
            testID="dose-drug-azitromisin"
            label={t('dose.azithromycin')}
            checked={form.obat_pilihan.azitromisin}
            onToggle={() => toggleDrug('azitromisin')}
          />
        </View>

        {fieldErrors.obat_pilihan && (
          <InlineAlert
            testID="dose-drugs-error"
            tone="danger"
            message={t(fieldErrors.obat_pilihan)}
          />
        )}
      </ClinicalCard>

      <GfrCalculatorCard
        testIDPrefix="dose-gfr"
        mode="standalone"
        value={form.gfr}
        onChangeValue={handleGfrChange}
        gender={gfrGender}
        onChangeGender={setGfrGender}
        error={fieldErrors.gfr ? t(fieldErrors.gfr) : null}
      />

      <MapInputCard
        testIDPrefix="dose-map"
        value={form.map_value}
        onChangeValue={handleMapChange}
        error={fieldErrors.map_value ? t(fieldErrors.map_value) : null}
      />

      <CtpCalculator
        testIDPrefix="dose-ctp"
        active={autoCtp}
        onToggleActive={handleToggleAutoCtp}
        params={ctpParams}
        onChangeParam={handleCtpParamChange}
        manualEncoded={CTP_CLASS_TO_ENCODED[form.ctp]}
        onChangeManualEncoded={(encoded) =>
          setForm((prev) => ({
            ...prev,
            ctp: ENCODED_TO_CTP_CLASS[encoded],
          }))
        }
      />

      <ClinicalCard>
        <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
          {t('dose.complications')}
        </Text>

        <CheckboxRow
          testID="dose-flag-ascites_refrakter"
          label={t('dose.ascitesRefractory')}
          checked={form.ascites_refrakter === 1}
          onToggle={() => toggleAcuteFlag('ascites_refrakter')}
        />
        <CheckboxRow
          testID="dose-flag-hrs"
          label={t('dose.hrs')}
          checked={form.hrs === 1}
          onToggle={() => toggleAcuteFlag('hrs')}
        />
        <CheckboxRow
          testID="dose-flag-sepsis_pneumonia"
          label={t('dose.sepsisPneumonia')}
          checked={form.sepsis_pneumonia === 1}
          onToggle={() => toggleAcuteFlag('sepsis_pneumonia')}
        />
        <CheckboxRow
          testID="dose-flag-ast_alt_tinggi"
          label={t('dose.astAltHigh')}
          checked={form.ast_alt_tinggi === 1}
          onToggle={() => toggleAcuteFlag('ast_alt_tinggi')}
        />
        <CheckboxRow
          testID="dose-flag-ckd"
          label={t('dose.ckd')}
          checked={form.isCKD}
          onToggle={() =>
            setForm((prev) => ({ ...prev, isCKD: !prev.isCKD }))
          }
        />
        <CheckboxRow
          testID="dose-flag-aki"
          label={t('dose.aki')}
          checked={form.isAKI}
          onToggle={() =>
            setForm((prev) => ({ ...prev, isAKI: !prev.isAKI }))
          }
        />
      </ClinicalCard>

      {apiError && (
        <InlineAlert
          testID="dose-api-error"
          tone="danger"
          message={apiError}
          action={
            <ClinicalButton
              testID="dose-retry-btn"
              variant="outlined"
              icon={RotateCcw}
              label={t('common.retry')}
              onPress={() => {
                void handleCheckRecommendation();
              }}
            />
          }
        />
      )}

      <ClinicalButton
        testID="dose-submit-btn"
        icon={Pill}
        label={
          loading ? t('dose.processingEngine') : t('dose.checkRecommendation')
        }
        loading={loading}
        onPress={() => {
          void handleCheckRecommendation();
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
            <DoseResultPanel result={result} testIDPrefix="dose-result" />
          ) : undefined
        }
      />

      {!isWide && (
        <ResultSheetModal
          testID="dose-result-modal"
          visible={sheetVisible && result !== null}
          title={t('dose.resultTitle')}
          onClose={() => setSheetVisible(false)}
        >
          <DoseResultPanel result={result} testIDPrefix="dose-result" />
        </ResultSheetModal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  drugHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupBox: {
    borderWidth: 1,
  },
});
