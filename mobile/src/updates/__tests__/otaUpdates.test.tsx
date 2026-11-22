import React from 'react';
import { AccessibilityInfo, Dimensions } from 'react-native';
import * as ReactNative from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import * as WebBrowser from 'expo-web-browser';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OtaUpdateStatusCard, UpdatePromptBanner } from '@/components/updates';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { OtaUpdateProvider } from '../OtaUpdateProvider';
import {
  applyOtaUpdateSafe,
  checkForOtaUpdateSafe,
  downloadOtaUpdateSafe,
  getApkDownloadUrl,
  isOtaSupportedRuntime,
} from '../otaService';

const mockCheckForUpdateAsync = jest.fn();
const mockFetchUpdateAsync = jest.fn();
const mockReloadAsync = jest.fn();
const mockUseUpdates = jest.fn(() => ({
  currentlyRunning: { isEmbeddedLaunch: true },
  isUpdateAvailable: false,
  isUpdatePending: false,
  availableUpdate: undefined,
  downloadedUpdate: undefined,
  checkError: undefined,
  downloadError: undefined,
  isChecking: false,
  isDownloading: false,
}));

jest.mock('expo-updates', () => ({
  isEnabled: true,
  isEmbeddedLaunch: true,
  updateId: null,
  channel: 'preview',
  runtimeVersion: '1.0.0',
  checkForUpdateAsync: (...args: unknown[]) => mockCheckForUpdateAsync(...args),
  fetchUpdateAsync: (...args: unknown[]) => mockFetchUpdateAsync(...args),
  reloadAsync: (...args: unknown[]) => mockReloadAsync(...args),
  useUpdates: () => mockUseUpdates(),
}));

const appConfig = require('../../../app.json');
const easConfig = require('../../../eas.json');

async function renderOtaUi(
  ui: React.ReactElement,
  { forceSupported = true, enableAutoCheck = true } = {}
) {
  Dimensions.set({
    window: { width: 390, height: 844, scale: 2, fontScale: 1 },
    screen: { width: 390, height: 844, scale: 2, fontScale: 1 },
  });
  jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({
    remove: jest.fn(),
  } as never);

  return await render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 24, left: 0, right: 0, bottom: 16 },
      }}
    >
      <LanguageProvider initialLanguage="id">
        <ThemeProvider>
          <OtaUpdateProvider
            enableAutoCheck={enableAutoCheck}
            forceSupportedForTest={forceSupported}
          >
            {ui}
          </OtaUpdateProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

describe('OTA In-App Updates Service, Banner & InfoHub Card', () => {
  const originalApkUrl = process.env.EXPO_PUBLIC_APK_DOWNLOAD_URL;

  beforeEach(() => {
    delete process.env.EXPO_PUBLIC_APK_DOWNLOAD_URL;
    mockCheckForUpdateAsync.mockReset();
    mockFetchUpdateAsync.mockReset();
    mockReloadAsync.mockReset();
  });

  afterEach(() => {
    if (originalApkUrl === undefined) {
      delete process.env.EXPO_PUBLIC_APK_DOWNLOAD_URL;
    } else {
      process.env.EXPO_PUBLIC_APK_DOWNLOAD_URL = originalApkUrl;
    }
    jest.restoreAllMocks();
  });

  it('configures app.json updates + runtimeVersion and EAS internal preview channel cleanly', () => {
    expect(appConfig.expo.runtimeVersion).toEqual({ policy: 'appVersion' });
    expect(appConfig.expo.updates.enabled).toBe(true);
    expect(appConfig.expo.updates.checkAutomatically).toBe('ON_ERROR_RECOVERY');

    expect(easConfig.build.preview.distribution).toBe('internal');
    expect(easConfig.build.preview.channel).toBe('preview');
    expect(easConfig.build.preview.android.buildType).toBe('apk');
  });

  it('guards dev/unsupported runtime and offline state cleanly in otaService', async () => {
    expect(isOtaSupportedRuntime(true, true)).toBe(false);
    expect(isOtaSupportedRuntime(false, false)).toBe(false);
    expect(isOtaSupportedRuntime(false, true)).toBe(true);

    expect(
      await checkForOtaUpdateSafe({ isDev: true, updatesEnabled: true })
    ).toEqual({ status: 'unsupported' });

    jest
      .spyOn(NetInfo, 'fetch')
      .mockResolvedValueOnce({ isConnected: false } as never);
    expect(
      await checkForOtaUpdateSafe({ isDev: false, updatesEnabled: true })
    ).toEqual({ status: 'offline' });

    expect(getApkDownloadUrl()).toBeNull();
    process.env.EXPO_PUBLIC_APK_DOWNLOAD_URL =
      'https://cirrhosmart.vercel.app/cirrhosmart.apk';
    expect(getApkDownloadUrl()).toBe(
      'https://cirrhosmart.vercel.app/cirrhosmart.apk'
    );
  });

  it('runs check -> notify banner -> download patch -> reload & apply inside the app', async () => {
    jest
      .spyOn(NetInfo, 'fetch')
      .mockResolvedValue({ isConnected: true } as never);
    mockCheckForUpdateAsync.mockResolvedValueOnce({
      isAvailable: true,
      manifest: { id: 'upd-uuid-123456', createdAt: '2026-11-22T08:00:00Z' },
      isRollBackToEmbedded: false,
      reason: undefined,
    });
    mockFetchUpdateAsync.mockResolvedValueOnce({
      isNew: true,
      isRollBackToEmbedded: false,
      manifest: { id: 'upd-uuid-123456' },
    });
    mockReloadAsync.mockResolvedValueOnce(undefined);

    const { getByTestId, queryByTestId } = await renderOtaUi(
      <>
        <UpdatePromptBanner />
        <OtaUpdateStatusCard />
      </>
    );

    await waitFor(() => {
      expect(getByTestId('ota-update-banner')).toBeTruthy();
    });
    expect(getByTestId('ota-banner-download-btn')).toBeTruthy();

    await fireEvent.press(getByTestId('ota-banner-download-btn'));
    expect(mockFetchUpdateAsync).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(getByTestId('ota-banner-apply-btn')).toBeTruthy();
    });
    expect(getByTestId('ota-card-status-ready')).toBeTruthy();

    await fireEvent.press(getByTestId('ota-banner-apply-btn'));
    expect(mockReloadAsync).toHaveBeenCalledTimes(1);

    // Dismiss hides global banner cleanly
    await fireEvent.press(getByTestId('ota-banner-dismiss-btn'));
    expect(queryByTestId('ota-update-banner')).toBeNull();
  });

  it('handles manual update check on unsupported runtime, error recovery, and website APK link cleanly', async () => {
    process.env.EXPO_PUBLIC_APK_DOWNLOAD_URL =
      'https://cirrhosmart.example.com/app.apk';
    const browserSpy = jest
      .spyOn(WebBrowser, 'openBrowserAsync')
      .mockResolvedValue({ type: 'dismiss' } as never);

    const { getByTestId, unmount } = await renderOtaUi(
      <OtaUpdateStatusCard />,
      { forceSupported: false, enableAutoCheck: false }
    );

    await fireEvent.press(getByTestId('ota-card-check-btn'));
    await waitFor(() => {
      expect(getByTestId('ota-card-status-unsupported')).toBeTruthy();
    });

    await fireEvent.press(getByTestId('ota-card-apk-download-btn'));
    expect(browserSpy).toHaveBeenCalledWith(
      'https://cirrhosmart.example.com/app.apk'
    );
    await unmount();

    // Error branch on downloadOtaUpdateSafe / applyOtaUpdateSafe
    jest
      .spyOn(NetInfo, 'fetch')
      .mockResolvedValue({ isConnected: true } as never);
    mockFetchUpdateAsync.mockRejectedValueOnce(new Error('Network dropped'));
    expect(
      await downloadOtaUpdateSafe({ isDev: false, updatesEnabled: true })
    ).toEqual({
      status: 'error',
      message: 'Network dropped',
    });

    mockReloadAsync.mockRejectedValueOnce(new Error('Reload blocked'));
    expect(await applyOtaUpdateSafe()).toBe(false);
  });
});
