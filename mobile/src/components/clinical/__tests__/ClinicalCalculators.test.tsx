import React, { useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import * as ReactNative from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LanguageProvider } from '@/i18n/LanguageProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';
import type { CtpEncoded, CtpParams, Gender } from '@/types/clinical';
import {
  CtpCalculator,
  GfrCalculatorCard,
  InrInputCard,
  MapInputCard,
  MeldScoreCard,
} from '../index';

const SAFE_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 24, left: 0, right: 0, bottom: 16 },
};

async function renderCalc(ui: React.ReactElement, lang: 'id' | 'en' = 'id') {
  jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({
    remove: jest.fn(),
  } as never);

  return await render(
    <SafeAreaProvider initialMetrics={SAFE_METRICS}>
      <LanguageProvider initialLanguage={lang}>
        <ThemeProvider>{ui}</ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

function CtpHarness() {
  const [active, setActive] = useState(false);
  const [manual, setManual] = useState<CtpEncoded>(1);
  const [params, setParams] = useState<CtpParams>({
    bilirubin: '',
    albumin: '',
    inr: '',
    ascites: '',
    encephalopathy: '',
  });
  return (
    <CtpCalculator
      active={active}
      onToggleActive={setActive}
      params={params}
      onChangeParam={(k, v) => setParams((prev) => ({ ...prev, [k]: v }))}
      manualEncoded={manual}
      onChangeManualEncoded={setManual}
    />
  );
}

function StandaloneGfrHarness({ onChange }: { onChange: (v: string) => void }) {
  const [gfr, setGfr] = useState('');
  const [gender, setGender] = useState<Gender>('L');
  return (
    <GfrCalculatorCard
      mode="standalone"
      value={gfr}
      onChangeValue={(next) => {
        setGfr(next);
        onChange(next);
      }}
      gender={gender}
      onChangeGender={setGender}
    />
  );
}

function LinkedGfrHarness({
  scr,
  age,
  onChange,
}: {
  scr: string;
  age: string;
  onChange: (v: string) => void;
}) {
  const [gfr, setGfr] = useState('');
  const [gender, setGender] = useState<Gender>('L');
  return (
    <GfrCalculatorCard
      mode="linked"
      value={gfr}
      onChangeValue={(next) => {
        setGfr(next);
        onChange(next);
      }}
      gender={gender}
      onChangeGender={setGender}
      linkedScr={scr}
      linkedAge={age}
    />
  );
}

function InrHarness({ onChange }: { onChange: (v: string) => void }) {
  const [val, setVal] = useState('');
  return (
    <InrInputCard
      value={val}
      onChangeValue={(next) => {
        setVal(next);
        onChange(next);
      }}
    />
  );
}

function MapHarness({ onChange }: { onChange: (v: string) => void }) {
  const [val, setVal] = useState('');
  return (
    <MapInputCard
      value={val}
      onChangeValue={(next) => {
        setVal(next);
        onChange(next);
      }}
    />
  );
}

describe('Clinical Calculator Components', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('CtpCalculator toggles auto parameters, disables manual select, and displays total score & class', async () => {
    const { getByTestId, queryByTestId, getByText } = await renderCalc(
      <CtpHarness />
    );

    expect(queryByTestId('ctp-auto-panel')).toBeNull();
    expect(getByTestId('ctp-manual-select').props.accessibilityState.disabled).toBe(
      false
    );

    await fireEvent.press(getByTestId('ctp-auto-toggle'));
    expect(getByTestId('ctp-auto-panel')).toBeTruthy();
    expect(getByTestId('ctp-manual-select').props.accessibilityState.disabled).toBe(
      true
    );

    const paramSelections: [string, string][] = [
      ['bilirubin', '2'],
      ['albumin', '2'],
      ['inr', '2'],
      ['ascites', '2'],
      ['encephalopathy', '2'],
    ];

    for (const [key, score] of paramSelections) {
      await fireEvent.press(getByTestId(`ctp-param-${key}`));
      await fireEvent.press(getByTestId(`ctp-param-${key}-option-${score}`));
    }

    expect(getByTestId('ctp-auto-result')).toBeTruthy();
    expect(getByText(/10/)).toBeTruthy();
    expect(getByText(/C$/)).toBeTruthy();
  });

  it('GfrCalculatorCard standalone calculates CKD-EPI 2021 with Indonesian comma decimals', async () => {
    const onChange = jest.fn();
    const { getByTestId } = await renderCalc(
      <StandaloneGfrHarness onChange={onChange} />
    );

    await fireEvent.press(getByTestId('gfr-auto-toggle'));
    await fireEvent.changeText(getByTestId('gfr-scr-input'), '1,1');
    await fireEvent.changeText(getByTestId('gfr-age-input'), '45');

    await waitFor(() => {
      expect(getByTestId('gfr-value-input').props.value).toBe('84.37');
    });
    expect(getByTestId('gfr-value-input').props.editable).toBe(false);
    expect(onChange).toHaveBeenLastCalledWith('84.37');
  });

  it('GfrCalculatorCard linked pulls external Scr & Age and reacts to gender toggle', async () => {
    const onChange = jest.fn();
    const { getByTestId } = await renderCalc(
      <LinkedGfrHarness scr="0,6" age="50" onChange={onChange} />
    );

    await fireEvent.press(getByTestId('gfr-auto-toggle'));
    expect(getByTestId('gfr-linked-note')).toBeTruthy();

    await fireEvent.press(getByTestId('gfr-gender-toggle-option-P'));
    await waitFor(() => {
      expect(getByTestId('gfr-value-input').props.value).toBe('109.28');
    });
  });

  it('InrInputCard supports both direct input and PT/Control/ISI calculation', async () => {
    const onChange = jest.fn();
    const { getByTestId, getByText } = await renderCalc(
      <InrHarness onChange={onChange} />
    );

    await fireEvent.changeText(getByTestId('inr-direct-input'), '1,35');
    expect(onChange).toHaveBeenLastCalledWith('1,35');

    await fireEvent.press(getByTestId('inr-mode-toggle-option-calculate'));
    expect(getByTestId('inr-calc-panel')).toBeTruthy();

    await fireEvent.changeText(getByTestId('inr-pt-patient-input'), '14,5');
    await fireEvent.changeText(getByTestId('inr-pt-normal-input'), '12,0');

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith('1.21');
      expect(getByText('1.21')).toBeTruthy();
    });
  });

  it('MapInputCard computes MAP from SBP and DBP automatically', async () => {
    const onChange = jest.fn();
    const { getByTestId } = await renderCalc(
      <MapHarness onChange={onChange} />
    );

    await fireEvent.press(getByTestId('map-auto-toggle'));
    await fireEvent.changeText(getByTestId('map-sbp-input'), '120');
    await fireEvent.changeText(getByTestId('map-dbp-input'), '80');

    await waitFor(() => {
      expect(getByTestId('map-value-input').props.value).toBe('93.33');
    });
    expect(getByTestId('map-value-input').props.editable).toBe(false);
  });

  it('MeldScoreCard renders waiting state or UNOS MELD score accurately', async () => {
    const { getByTestId, rerender } = await renderCalc(
      <MeldScoreCard bilirubin="" inr="1.1" creatinine="1.0" />,
      'en'
    );
    expect(getByTestId('meld-score-card-waiting')).toBeTruthy();

    await rerender(
      <SafeAreaProvider initialMetrics={SAFE_METRICS}>
        <LanguageProvider initialLanguage="en">
          <ThemeProvider>
            <MeldScoreCard bilirubin="0,4" inr="1,11" creatinine="2,7" />
          </ThemeProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    );
    expect(getByTestId('meld-score-card-value').props.children).toBe('17.1');
  });
});
