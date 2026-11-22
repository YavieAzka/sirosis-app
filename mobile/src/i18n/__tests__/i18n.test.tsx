import React from 'react';
import { Pressable, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ExpoLocalization from 'expo-localization';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import en from '@/locales/en.json';
import id from '@/locales/id.json';
import { LANGUAGE_STORAGE_KEY, resolveDeviceLanguage } from '../index';
import { LanguageProvider, useAppLanguage } from '../LanguageProvider';

function collectLeafKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      keys.push(...collectLeafKeys(v as Record<string, unknown>, path));
    } else {
      expect(typeof v).toBe('string');
      expect((v as string).trim().length).toBeGreaterThan(0);
      keys.push(path);
    }
  }
  return keys.sort();
}

function LanguageProbe() {
  const { language, isHydrated, toggleLanguage, t } = useAppLanguage();
  return (
    <>
      <Text testID="lang-code">{language}</Text>
      <Text testID="hydrated">{String(isHydrated)}</Text>
      <Text testID="los-title">{t('los.title')}</Text>
      <Pressable testID="toggle-lang-btn" onPress={() => void toggleLanguage()} />
    </>
  );
}

describe('i18n dictionaries & LanguageProvider', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('maintains 100% key parity and non-empty strings between id.json and en.json', () => {
    const idKeys = collectLeafKeys(id);
    const enKeys = collectLeafKeys(en);
    expect(idKeys).toEqual(enKeys);
  });

  it('resolves device locale defaulting to id unless primary language is en', () => {
    expect(resolveDeviceLanguage([{ languageCode: 'en' }])).toBe('en');
    expect(resolveDeviceLanguage([{ languageCode: 'EN' }])).toBe('en');
    expect(resolveDeviceLanguage([{ languageCode: 'id' }])).toBe('id');
    expect(resolveDeviceLanguage([{ languageCode: 'fr' }])).toBe('id');
    expect(resolveDeviceLanguage([])).toBe('id');
  });

  it('hydrates stored language from AsyncStorage and persists toggles', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValue('en');
    const setItemSpy = jest
      .spyOn(AsyncStorage, 'setItem')
      .mockResolvedValue(undefined);
    jest
      .spyOn(ExpoLocalization, 'getLocales')
      .mockReturnValue([{ languageCode: 'id' }] as never);

    const { getByTestId } = await render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(getByTestId('hydrated').props.children).toBe('true');
      expect(getByTestId('lang-code').props.children).toBe('en');
    });
    expect(getByTestId('los-title').props.children).toBe(
      'Length of Stay (LoS) Calculator'
    );

    await fireEvent.press(getByTestId('toggle-lang-btn'));
    await waitFor(() => {
      expect(getByTestId('lang-code').props.children).toBe('id');
    });
    expect(getByTestId('los-title').props.children).toBe(
      'Kalkulator Lama Rawat (LoS)'
    );
    expect(setItemSpy).toHaveBeenCalledWith(LANGUAGE_STORAGE_KEY, 'id');
  });

  it('falls back to device locale when AsyncStorage has no saved preference', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValue(null);
    jest
      .spyOn(ExpoLocalization, 'getLocales')
      .mockReturnValue([{ languageCode: 'en' }] as never);

    const { getByTestId } = await render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(getByTestId('hydrated').props.children).toBe('true');
      expect(getByTestId('lang-code').props.children).toBe('en');
    });
  });

  it('throws clear error when useAppLanguage is called outside LanguageProvider', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(render(<LanguageProbe />)).rejects.toThrow(
      'useAppLanguage must be used within LanguageProvider'
    );
    spy.mockRestore();
  });
});
