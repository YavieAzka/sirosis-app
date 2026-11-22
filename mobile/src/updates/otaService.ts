import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import NetInfo from '@react-native-community/netinfo';

export type OtaCheckOutcome =
  | {
      status: 'available';
      updateId: string | null;
      createdAt: string | null;
    }
  | { status: 'up-to-date' }
  | { status: 'unsupported' }
  | { status: 'offline' }
  | { status: 'error'; message: string };

export type OtaDownloadOutcome =
  | { status: 'ready' }
  | { status: 'up-to-date' }
  | { status: 'unsupported' }
  | { status: 'offline' }
  | { status: 'error'; message: string };

export interface OtaEnvironmentInfo {
  isEnabled: boolean;
  isEmbeddedLaunch: boolean;
  updateId: string | null;
  channel: string | null;
  runtimeVersion: string | null;
  appVersion: string;
}

export function isOtaSupportedRuntime(
  isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : false,
  updatesEnabled = Boolean(Updates.isEnabled)
): boolean {
  return !isDev && updatesEnabled;
}

export function getOtaEnvironmentInfo(): OtaEnvironmentInfo {
  return {
    isEnabled: Boolean(Updates.isEnabled),
    isEmbeddedLaunch: Updates.isEmbeddedLaunch ?? true,
    updateId: Updates.updateId ?? null,
    channel: Updates.channel ?? null,
    runtimeVersion: Updates.runtimeVersion ?? null,
    appVersion: Constants.expoConfig?.version ?? '1.0.0',
  };
}

export function getApkDownloadUrl(): string | null {
  const raw = (process.env.EXPO_PUBLIC_APK_DOWNLOAD_URL ?? '').trim();
  if (!raw || !/^https?:\/\/.+/.test(raw)) {
    return null;
  }
  return raw;
}

export async function checkForOtaUpdateSafe(options?: {
  isDev?: boolean;
  updatesEnabled?: boolean;
}): Promise<OtaCheckOutcome> {
  const supported = isOtaSupportedRuntime(
    options?.isDev,
    options?.updatesEnabled
  );
  if (!supported) {
    return { status: 'unsupported' };
  }

  try {
    const netState = await NetInfo.fetch();
    if (netState.isConnected === false) {
      return { status: 'offline' };
    }

    const result = await Updates.checkForUpdateAsync();
    if (result.isAvailable) {
      const manifestRecord = result.manifest as
        | { id?: string; createdAt?: string }
        | undefined;
      return {
        status: 'available',
        updateId: manifestRecord?.id ?? null,
        createdAt: manifestRecord?.createdAt ?? null,
      };
    }

    return { status: 'up-to-date' };
  } catch (err) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function downloadOtaUpdateSafe(options?: {
  isDev?: boolean;
  updatesEnabled?: boolean;
}): Promise<OtaDownloadOutcome> {
  const supported = isOtaSupportedRuntime(
    options?.isDev,
    options?.updatesEnabled
  );
  if (!supported) {
    return { status: 'unsupported' };
  }

  try {
    const netState = await NetInfo.fetch();
    if (netState.isConnected === false) {
      return { status: 'offline' };
    }

    const result = await Updates.fetchUpdateAsync();
    if (result.isNew || result.isRollBackToEmbedded) {
      return { status: 'ready' };
    }
    return { status: 'up-to-date' };
  } catch (err) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function applyOtaUpdateSafe(): Promise<boolean> {
  try {
    await Updates.reloadAsync();
    return true;
  } catch {
    return false;
  }
}
