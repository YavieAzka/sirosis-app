import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Database, Eye, EyeOff } from 'lucide-react-native';

import {
  ClinicalButton,
  ClinicalCard,
  ClinicalNumberInput,
  InlineAlert,
} from '@/components/ui';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import { useAppTheme } from '@/theme/ThemeProvider';
import { TOUCH_TARGET } from '@/theme/tokens';
import { getApiErrorMessage } from '@/utils/apiErrors';
import { triggerErrorHaptic, triggerSuccessHaptic } from '@/utils/haptics';
import { validateSaveToken } from '@/utils/validation';

export interface SaveMetadata {
  token: string;
  patientName: string;
  medicalRecordNumber: string;
}

export interface SaveToDatabaseSectionProps {
  onSave: (meta: SaveMetadata) => Promise<void>;
  successMessage: string;
  testIDPrefix?: string;
}

export function SaveToDatabaseSection({
  onSave,
  successMessage,
  testIDPrefix = 'save-db',
}: SaveToDatabaseSectionProps) {
  const { theme } = useAppTheme();
  const { t } = useAppLanguage();
  const { colors, typography, spacing } = theme;

  const [patientName, setPatientName] = useState('');
  const [mrn, setMrn] = useState('');
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handlePressSave = async () => {
    const errKey = validateSaveToken(token);
    if (errKey) {
      setTokenError(t(errKey));
      setSubmitError(null);
      await triggerErrorHaptic();
      return;
    }

    setTokenError(null);
    setSubmitError(null);
    setSaved(false);
    setSaving(true);

    try {
      await onSave({
        token,
        patientName,
        medicalRecordNumber: mrn,
      });
      setSaved(true);
      setToken('');
      setShowToken(false);
      await triggerSuccessHaptic();
    } catch (error: unknown) {
      setSubmitError(getApiErrorMessage(error, t));
      await triggerErrorHaptic();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ClinicalCard testID={`${testIDPrefix}-card`} tone="neutral">
      <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
        {t('save.authTitle')}
      </Text>

      <ClinicalNumberInput
        testID={`${testIDPrefix}-name-input`}
        label={t('save.patientNameLabel')}
        placeholder={t('save.patientNamePlaceholder')}
        keyboardType="default"
        value={patientName}
        onChangeText={setPatientName}
      />

      <ClinicalNumberInput
        testID={`${testIDPrefix}-mrn-input`}
        label={t('save.mrnLabel')}
        placeholder={t('save.mrnPlaceholder')}
        keyboardType="default"
        value={mrn}
        onChangeText={setMrn}
      />

      <ClinicalNumberInput
        testID={`${testIDPrefix}-token-input`}
        label={t('save.tokenLabel')}
        placeholder={t('save.tokenPlaceholder')}
        keyboardType="default"
        secureTextEntry={!showToken}
        value={token}
        error={tokenError}
        onChangeText={(text) => {
          setToken(text);
          if (tokenError) setTokenError(null);
          if (submitError) setSubmitError(null);
          if (saved) setSaved(false);
        }}
        rightAccessory={
          <Pressable
            testID={`${testIDPrefix}-token-visibility`}
            onPress={() => setShowToken((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel={
              showToken ? t('save.hideToken') : t('save.showToken')
            }
            style={styles.eyeButton}
          >
            {showToken ? (
              <EyeOff size={20} color={colors.onSurfaceVariant} strokeWidth={2} />
            ) : (
              <Eye size={20} color={colors.onSurfaceVariant} strokeWidth={2} />
            )}
          </Pressable>
        }
      />

      {submitError && (
        <InlineAlert
          testID={`${testIDPrefix}-error`}
          tone="danger"
          message={submitError}
        />
      )}

      {saved && (
        <InlineAlert
          testID={`${testIDPrefix}-success`}
          tone="safe"
          message={successMessage}
        />
      )}

      <View style={{ marginTop: spacing.xs }}>
        <ClinicalButton
          testID={`${testIDPrefix}-submit`}
          label={saving ? t('save.btnSaving') : t('save.btnSave')}
          icon={Database}
          loading={saving}
          onPress={() => {
            void handlePressSave();
          }}
        />
      </View>
    </ClinicalCard>
  );
}

const styles = StyleSheet.create({
  eyeButton: {
    minWidth: TOUCH_TARGET.MIN_SIZE_DP,
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
