import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import { openExternalUrl, openMailto } from '../externalLinks';

describe('externalLinks utilities', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('openExternalUrl', () => {
    it('rejects non-HTTP(S) schemes without calling browser or Linking', async () => {
      const browserSpy = jest.spyOn(WebBrowser, 'openBrowserAsync');
      const linkingSpy = jest.spyOn(Linking, 'openURL');

      expect(await openExternalUrl('')).toBe(false);
      expect(await openExternalUrl('ftp://example.com')).toBe(false);
      expect(await openExternalUrl('javascript:alert(1)')).toBe(false);

      expect(browserSpy).not.toHaveBeenCalled();
      expect(linkingSpy).not.toHaveBeenCalled();
    });

    it('opens valid HTTPS URLs via expo-web-browser', async () => {
      const browserSpy = jest
        .spyOn(WebBrowser, 'openBrowserAsync')
        .mockResolvedValue({ type: 'dismiss' } as never);

      const ok = await openExternalUrl('  https://doi.org/10.1002/hep.31884  ');

      expect(ok).toBe(true);
      expect(browserSpy).toHaveBeenCalledWith(
        'https://doi.org/10.1002/hep.31884'
      );
    });

    it('falls back to Linking.openURL when WebBrowser fails, and returns false if both fail', async () => {
      jest
        .spyOn(WebBrowser, 'openBrowserAsync')
        .mockRejectedValue(new Error('No custom tabs'));
      const linkingSpy = jest
        .spyOn(Linking, 'openURL')
        .mockResolvedValueOnce(true as never);

      expect(await openExternalUrl('https://doi.org/10.1016/test')).toBe(true);
      expect(linkingSpy).toHaveBeenCalledWith('https://doi.org/10.1016/test');

      linkingSpy.mockRejectedValueOnce(new Error('Cannot open'));
      expect(await openExternalUrl('https://doi.org/10.1016/test')).toBe(false);
    });
  });

  describe('openMailto', () => {
    it('constructs encoded mailto URL and handles errors gracefully', async () => {
      const linkingSpy = jest
        .spyOn(Linking, 'openURL')
        .mockResolvedValueOnce(true as never);

      expect(await openMailto('')).toBe(false);

      const ok = await openMailto(
        'serdiani.farmasi1@gmail.com',
        'Pertanyaan Riset: CirrhoSmart AI'
      );
      expect(ok).toBe(true);
      expect(linkingSpy).toHaveBeenCalledWith(
        'mailto:serdiani.farmasi1@gmail.com?subject=Pertanyaan%20Riset%3A%20CirrhoSmart%20AI'
      );

      linkingSpy.mockRejectedValueOnce(new Error('No email app'));
      expect(await openMailto('serdiani.farmasi1@gmail.com')).toBe(false);
    });
  });
});
