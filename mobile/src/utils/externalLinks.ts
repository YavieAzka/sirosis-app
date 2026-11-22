import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

/**
 * Opens an HTTP/HTTPS URL inside an in-app browser sheet via expo-web-browser,
 * falling back to native Linking if Custom Tabs is unavailable.
 */
export async function openExternalUrl(url: string): Promise<boolean> {
  const normalized = url.trim();
  if (!/^https?:\/\/.+/.test(normalized)) {
    return false;
  }

  try {
    await WebBrowser.openBrowserAsync(normalized);
    return true;
  } catch {
    try {
      await Linking.openURL(normalized);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Opens the device's default email client for the given recipient and optional subject.
 */
export async function openMailto(
  email: string,
  subject?: string
): Promise<boolean> {
  const recipient = email.trim();
  if (!recipient) {
    return false;
  }
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  const mailtoUrl = `mailto:${recipient}${query}`;

  try {
    await Linking.openURL(mailtoUrl);
    return true;
  } catch {
    return false;
  }
}
