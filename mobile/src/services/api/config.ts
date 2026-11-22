import { ApiError } from './errors';

export const DEFAULT_API_TIMEOUT_MS = 20000;

export function getApiBaseUrl(): string {
  const raw = (process.env.EXPO_PUBLIC_API_URL ?? '').trim();
  if (!raw) {
    throw new ApiError(
      'CONFIG',
      'EXPO_PUBLIC_API_URL is not configured.'
    );
  }
  const normalized = raw.replace(/\/+$/, '');
  if (!/^https?:\/\/.+/.test(normalized)) {
    throw new ApiError(
      'CONFIG',
      `EXPO_PUBLIC_API_URL must start with http:// or https:// (received "${raw}").`
    );
  }
  return normalized;
}
