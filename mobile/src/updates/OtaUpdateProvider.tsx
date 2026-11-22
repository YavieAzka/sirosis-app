import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppState } from 'react-native';
import * as Updates from 'expo-updates';

import {
  applyOtaUpdateSafe,
  checkForOtaUpdateSafe,
  downloadOtaUpdateSafe,
  getApkDownloadUrl,
  getOtaEnvironmentInfo,
  isOtaSupportedRuntime,
  type OtaCheckOutcome,
  type OtaEnvironmentInfo,
} from './otaService';

export type OtaUiStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'downloading'
  | 'ready'
  | 'up-to-date'
  | 'unsupported'
  | 'offline'
  | 'error';

export const AUTO_CHECK_INTERVAL_MS = 5 * 60 * 1000;

export interface OtaUpdateContextValue {
  status: OtaUiStatus;
  availableUpdateId: string | null;
  errorMessage: string | null;
  bannerDismissed: boolean;
  envInfo: OtaEnvironmentInfo;
  apkDownloadUrl: string | null;
  checkForUpdates: (options?: { manual?: boolean }) => Promise<void>;
  downloadUpdate: () => Promise<void>;
  applyUpdate: () => Promise<void>;
  dismissBanner: () => void;
}

const OtaUpdateContext = createContext<OtaUpdateContextValue | null>(null);

export interface OtaUpdateProviderProps {
  children: React.ReactNode;
  enableAutoCheck?: boolean;
  forceSupportedForTest?: boolean;
}

export function OtaUpdateProvider({
  children,
  enableAutoCheck = true,
  forceSupportedForTest,
}: OtaUpdateProviderProps) {
  const nativeUpdates = Updates.useUpdates();
  const [manualStatus, setManualStatus] = useState<OtaUiStatus>('idle');
  const [availableUpdateId, setAvailableUpdateId] = useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(false);

  const runtimeOptions = useMemo(
    () =>
      forceSupportedForTest !== undefined
        ? {
            isDev: !forceSupportedForTest,
            updatesEnabled: forceSupportedForTest,
          }
        : undefined,
    [forceSupportedForTest]
  );

  const applyCheckOutcome = useCallback(
    (outcome: OtaCheckOutcome, manual: boolean) => {
      if (outcome.status === 'available') {
        setAvailableUpdateId(outcome.updateId);
        setBannerDismissed(false);
        setErrorMessage(null);
        setManualStatus('available');
        return;
      }

      if (outcome.status === 'error') {
        setErrorMessage(outcome.message);
        setManualStatus('error');
        return;
      }

      if (manual) {
        setManualStatus(outcome.status);
      }
    },
    []
  );

  useEffect(() => {
    if (!enableAutoCheck) {
      return undefined;
    }

    const supported =
      forceSupportedForTest !== undefined
        ? forceSupportedForTest
        : isOtaSupportedRuntime();
    if (!supported) {
      return undefined;
    }

    let active = true;
    let inFlight = false;
    let lastCheckedAt = 0;

    const runBackgroundCheck = () => {
      if (inFlight) {
        return;
      }
      const now = Date.now();
      if (now - lastCheckedAt < AUTO_CHECK_INTERVAL_MS) {
        return;
      }
      inFlight = true;
      checkForOtaUpdateSafe(runtimeOptions)
        .then((outcome) => {
          lastCheckedAt = Date.now();
          if (active) {
            applyCheckOutcome(outcome, false);
          }
        })
        .catch(() => {
          // Safe wrapper does not throw; ignore unexpected runtime exceptions
        })
        .finally(() => {
          inFlight = false;
        });
    };

    runBackgroundCheck();

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        runBackgroundCheck();
      }
    });

    return () => {
      active = false;
      subscription.remove();
    };
  }, [
    applyCheckOutcome,
    enableAutoCheck,
    forceSupportedForTest,
    runtimeOptions,
  ]);

  const checkForUpdates = useCallback(
    async (options?: { manual?: boolean }) => {
      const manual = options?.manual ?? true;
      if (manual) {
        setBannerDismissed(false);
        setErrorMessage(null);
        setManualStatus('checking');
      }
      const outcome = await checkForOtaUpdateSafe(runtimeOptions);
      applyCheckOutcome(outcome, manual);
    },
    [applyCheckOutcome, runtimeOptions]
  );

  const downloadUpdate = useCallback(async () => {
    setErrorMessage(null);
    setBannerDismissed(false);
    setManualStatus('downloading');

    const outcome = await downloadOtaUpdateSafe(runtimeOptions);
    if (outcome.status === 'ready') {
      setManualStatus('ready');
      return;
    }

    if (outcome.status === 'error') {
      setErrorMessage(outcome.message);
      setManualStatus('error');
      return;
    }

    setManualStatus(outcome.status);
  }, [runtimeOptions]);

  const applyUpdate = useCallback(async () => {
    const ok = await applyOtaUpdateSafe();
    if (!ok) {
      setErrorMessage('reload_failed');
      setManualStatus('error');
    }
  }, []);

  const dismissBanner = useCallback(() => {
    setBannerDismissed(true);
  }, []);

  const effectiveStatus = useMemo<OtaUiStatus>(() => {
    if (nativeUpdates.isUpdatePending) {
      return 'ready';
    }
    if (manualStatus !== 'idle') {
      return manualStatus;
    }
    if (nativeUpdates.isUpdateAvailable) {
      return 'available';
    }
    if (nativeUpdates.downloadError || nativeUpdates.checkError) {
      return 'error';
    }
    return 'idle';
  }, [manualStatus, nativeUpdates]);

  const resolvedError =
    errorMessage ??
    nativeUpdates.downloadError?.message ??
    nativeUpdates.checkError?.message ??
    null;

  const envInfo = useMemo(() => getOtaEnvironmentInfo(), []);
  const apkDownloadUrl = useMemo(() => getApkDownloadUrl(), []);

  const value = useMemo<OtaUpdateContextValue>(
    () => ({
      status: effectiveStatus,
      availableUpdateId:
        availableUpdateId ??
        nativeUpdates.availableUpdate?.updateId ??
        null,
      errorMessage: resolvedError,
      bannerDismissed,
      envInfo,
      apkDownloadUrl,
      checkForUpdates,
      downloadUpdate,
      applyUpdate,
      dismissBanner,
    }),
    [
      effectiveStatus,
      availableUpdateId,
      nativeUpdates.availableUpdate?.updateId,
      resolvedError,
      bannerDismissed,
      envInfo,
      apkDownloadUrl,
      checkForUpdates,
      downloadUpdate,
      applyUpdate,
      dismissBanner,
    ]
  );

  return (
    <OtaUpdateContext.Provider value={value}>
      {children}
    </OtaUpdateContext.Provider>
  );
}

export function useOtaUpdates(): OtaUpdateContextValue {
  const ctx = useContext(OtaUpdateContext);
  if (!ctx) {
    throw new Error('useOtaUpdates must be used within OtaUpdateProvider');
  }
  return ctx;
}

export function useOptionalOtaUpdates(): OtaUpdateContextValue | null {
  return useContext(OtaUpdateContext);
}
