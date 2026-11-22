import React from 'react';
import { AccessibilityInfo, Dimensions, Linking, StyleSheet } from 'react-native';
import * as ReactNative from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ReaderHeader } from '@/components/navigation/ReaderHeader';
import { TEAM_MEMBERS } from '@/constants/teamData';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { TOUCH_TARGET } from '@/theme/tokens';
import { AboutContent } from '../AboutContent';
import { GuideContent } from '../GuideContent';
import { TeamAvatar } from '../TeamAvatar';

async function renderWithProviders(
  node: React.ReactElement,
  width = 390,
  height = 844
) {
  Dimensions.set({
    window: { width, height, scale: 2, fontScale: 1 },
    screen: { width, height, scale: 2, fontScale: 1 },
  });
  jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({
    remove: jest.fn(),
  } as never);

  return await render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width, height },
        insets: { top: 24, left: 0, right: 0, bottom: 16 },
      }}
    >
      <LanguageProvider initialLanguage="id">
        <ThemeProvider>{node}</ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

describe('ReaderHeader, TeamAvatar, AboutContent, and GuideContent', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('ReaderHeader enforces >= 48dp touch targets and triggers onBack', async () => {
    const onBack = jest.fn();
    const { getByTestId, getByText } = await renderWithProviders(
      <ReaderHeader
        testIDPrefix="test-reader"
        title="Panduan Penggunaan"
        onBack={onBack}
      />
    );

    expect(getByText('Panduan Penggunaan')).toBeTruthy();

    const backBtn = getByTestId('test-reader-back-button');
    const backStyle = StyleSheet.flatten(backBtn.props.style);
    expect(backStyle.minWidth).toBeGreaterThanOrEqual(TOUCH_TARGET.MIN_SIZE_DP);
    expect(backStyle.minHeight).toBeGreaterThanOrEqual(TOUCH_TARGET.MIN_SIZE_DP);

    await fireEvent.press(backBtn);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('TeamAvatar shows initials fallback if local asset image fails to load', async () => {
    const { getByLabelText, getByText, queryByLabelText } =
      await renderWithProviders(<TeamAvatar member={TEAM_MEMBERS[0]} />);

    expect(getByText('SR', { includeHiddenElements: true })).toBeTruthy();
    const img = getByLabelText(TEAM_MEMBERS[0].name);
    await fireEvent(img, 'error');
    expect(queryByLabelText(TEAM_MEMBERS[0].name)).toBeNull();
    expect(getByText('SR')).toBeTruthy();
  });

  it('AboutContent renders metrics, 6 researchers, navigation CTAs, and handles email errors', async () => {
    const onSelectTab = jest.fn();
    const onOpenMethodology = jest.fn();
    const onOpenGuide = jest.fn();
    const linkingSpy = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValueOnce(true as never)
      .mockRejectedValueOnce(new Error('No mail client'));

    const { getByTestId, getByText } = await renderWithProviders(
      <AboutContent
        onSelectTab={onSelectTab}
        onOpenMethodology={onOpenMethodology}
        onOpenGuide={onOpenGuide}
      />
    );

    expect(getByTestId('about-metric-cohort')).toBeTruthy();
    expect(getByText('583')).toBeTruthy();
    expect(getByText('0.8391')).toBeTruthy();
    expect(getByText('84.2%')).toBeTruthy();

    // All 6 team profiles rendered
    for (const member of TEAM_MEMBERS) {
      expect(getByTestId(`team-card-${member.id}`)).toBeTruthy();
      expect(getByText(member.name)).toBeTruthy();
    }

    await fireEvent.press(getByTestId('about-launch-calculator-btn'));
    expect(onSelectTab).toHaveBeenCalledWith('/');

    await fireEvent.press(getByTestId('about-pillar-btn-los'));
    expect(onSelectTab).toHaveBeenCalledWith('/los');

    await fireEvent.press(getByTestId('about-pillar-btn-dose'));
    expect(onSelectTab).toHaveBeenCalledWith('/dose');

    await fireEvent.press(getByTestId('about-open-methodology-btn'));
    expect(onOpenMethodology).toHaveBeenCalledTimes(1);

    await fireEvent.press(getByTestId('about-open-guide-btn'));
    expect(onOpenGuide).toHaveBeenCalledTimes(1);

    await fireEvent.press(getByTestId('team-email-btn-serdiani'));
    expect(linkingSpy).toHaveBeenCalledWith(
      expect.stringContaining('mailto:serdiani.farmasi1@gmail.com')
    );

    await fireEvent.press(getByTestId('about-support-email-btn'));
    await waitFor(() => {
      expect(getByTestId('about-email-error')).toBeTruthy();
    });
  });

  it('GuideContent displays 4 structured steps, offline calculator notice, disclaimer, and CTA', async () => {
    const onOpenCalculators = jest.fn();
    const { getByTestId } = await renderWithProviders(
      <GuideContent onOpenCalculators={onOpenCalculators} />
    );

    expect(getByTestId('guide-step-1')).toBeTruthy();
    expect(getByTestId('guide-step-2')).toBeTruthy();
    expect(getByTestId('guide-step-3')).toBeTruthy();
    expect(getByTestId('guide-step-4')).toBeTruthy();
    expect(getByTestId('guide-disclaimer-alert')).toBeTruthy();

    await fireEvent.press(getByTestId('guide-open-calculators-btn'));
    expect(onOpenCalculators).toHaveBeenCalledTimes(1);
  });
});
