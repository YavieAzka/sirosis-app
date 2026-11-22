import React from 'react';
import { AccessibilityInfo, StyleSheet } from 'react-native';
import * as ReactNative from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LanguageProvider } from '@/i18n/LanguageProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { TOUCH_TARGET } from '@/theme/tokens';
import {
  CheckboxRow,
  ClinicalButton,
  ClinicalNumberInput,
  InlineAlert,
  MaterialSelectSheet,
  SegmentedToggle,
  SwitchRow,
} from '../index';

const SAFE_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 24, left: 0, right: 0, bottom: 16 },
};

async function renderWithProviders(ui: React.ReactElement) {
  jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({
    remove: jest.fn(),
  } as never);

  return await render(
    <SafeAreaProvider initialMetrics={SAFE_METRICS}>
      <LanguageProvider initialLanguage="id">
        <ThemeProvider>{ui}</ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

describe('Material Design 3 UI primitives', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('ClinicalButton enforces 48dp minimum height and disables press when loading/disabled', async () => {
    const onPress = jest.fn();
    const { getByTestId, rerender } = await renderWithProviders(
      <ClinicalButton testID="btn" label="Proses" onPress={onPress} />
    );

    const btn = getByTestId('btn');
    const style = StyleSheet.flatten(btn.props.style);
    expect(style.minHeight).toBeGreaterThanOrEqual(TOUCH_TARGET.MIN_SIZE_DP);
    expect(btn.props.accessibilityRole).toBe('button');

    await fireEvent.press(btn);
    expect(onPress).toHaveBeenCalledTimes(1);

    await rerender(
      <SafeAreaProvider initialMetrics={SAFE_METRICS}>
        <LanguageProvider initialLanguage="id">
          <ThemeProvider>
            <ClinicalButton testID="btn" label="Memproses..." onPress={onPress} loading />
          </ThemeProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    );
    expect(getByTestId('btn-spinner')).toBeTruthy();
    expect(getByTestId('btn').props.accessibilityState).toEqual({
      disabled: true,
      busy: true,
    });
  });

  it('ClinicalNumberInput renders unit suffix, inline error, and readOnly state', async () => {
    const onChange = jest.fn();
    const { getByTestId, getByText } = await renderWithProviders(
      <ClinicalNumberInput
        testID="num-input"
        label="Urea Baseline"
        value="25,5"
        unit="mg/dL"
        error="Wajib diisi."
        editable={false}
        onChangeText={onChange}
      />
    );

    const input = getByTestId('num-input');
    expect(input.props.editable).toBe(false);
    expect(input.props.keyboardType).toBe('decimal-pad');
    expect(getByText('mg/dL')).toBeTruthy();
    expect(getByText('Wajib diisi.')).toBeTruthy();
  });

  it('MaterialSelectSheet opens bottom sheet on press, selects an option, and dismisses', async () => {
    const onSelect = jest.fn();
    const { getByTestId, queryByTestId } = await renderWithProviders(
      <MaterialSelectSheet
        testID="ctp-select"
        label="Kelas CTP"
        value="1"
        options={[
          { value: '1', label: 'Kelas A' },
          { value: '2', label: 'Kelas B' },
        ]}
        onSelect={onSelect}
      />
    );

    const trigger = getByTestId('ctp-select');
    expect(StyleSheet.flatten(trigger.props.style).minHeight).toBeGreaterThanOrEqual(
      TOUCH_TARGET.MIN_SIZE_DP
    );
    expect(queryByTestId('ctp-select-sheet')).toBeNull();

    await fireEvent.press(trigger);
    expect(getByTestId('ctp-select-sheet')).toBeTruthy();

    const opt2 = getByTestId('ctp-select-option-2');
    expect(StyleSheet.flatten(opt2.props.style).minHeight).toBeGreaterThanOrEqual(
      TOUCH_TARGET.MIN_SIZE_DP
    );
    await fireEvent.press(opt2);

    expect(onSelect).toHaveBeenCalledWith('2');
    expect(queryByTestId('ctp-select-sheet')).toBeNull();
  });

  it('MaterialSelectSheet does not open when disabled', async () => {
    const { getByTestId, queryByTestId } = await renderWithProviders(
      <MaterialSelectSheet
        testID="disabled-select"
        label="Kelas CTP"
        value="1"
        disabled
        options={[{ value: '1', label: 'Kelas A' }]}
        onSelect={jest.fn()}
      />
    );

    await fireEvent.press(getByTestId('disabled-select'));
    expect(queryByTestId('disabled-select-sheet')).toBeNull();
  });

  it('SegmentedToggle, SwitchRow, CheckboxRow, and InlineAlert expose accessible states and 48dp touch targets', async () => {
    const onSegmentChange = jest.fn();
    const onSwitchChange = jest.fn();
    const onCheckToggle = jest.fn();

    const { getByTestId, getByText } = await renderWithProviders(
      <>
        <SegmentedToggle
          testID="seg"
          value="direct"
          options={[
            { value: 'direct', label: 'Input Langsung' },
            { value: 'calc', label: 'Hitung dari PT' },
          ]}
          onChange={onSegmentChange}
        />
        <SwitchRow
          testID="sw"
          label="Hitung Otomatis"
          value={false}
          onValueChange={onSwitchChange}
        />
        <CheckboxRow
          testID="chk"
          label="Sepsis"
          checked={true}
          onToggle={onCheckToggle}
        />
        <InlineAlert
          testID="alert"
          tone="warning"
          title="Perhatian"
          message="Wajib review klinis"
        />
      </>
    );

    const segOpt = getByTestId('seg-option-calc');
    expect(StyleSheet.flatten(segOpt.props.style).minHeight).toBeGreaterThanOrEqual(
      TOUCH_TARGET.MIN_SIZE_DP
    );
    await fireEvent.press(segOpt);
    expect(onSegmentChange).toHaveBeenCalledWith('calc');

    const sw = getByTestId('sw');
    expect(StyleSheet.flatten(sw.props.style).minHeight).toBeGreaterThanOrEqual(
      TOUCH_TARGET.MIN_SIZE_DP
    );
    expect(sw.props.accessibilityRole).toBe('switch');
    await fireEvent.press(sw);
    expect(onSwitchChange).toHaveBeenCalledWith(true);

    const chk = getByTestId('chk');
    expect(StyleSheet.flatten(chk.props.style).minHeight).toBeGreaterThanOrEqual(
      TOUCH_TARGET.MIN_SIZE_DP
    );
    expect(chk.props.accessibilityRole).toBe('checkbox');
    expect(chk.props.accessibilityState).toEqual({
      checked: true,
      disabled: false,
    });
    await fireEvent.press(chk);
    expect(onCheckToggle).toHaveBeenCalledTimes(1);

    expect(getByTestId('alert')).toBeTruthy();
    expect(getByText('Wajib review klinis')).toBeTruthy();
  });
});
