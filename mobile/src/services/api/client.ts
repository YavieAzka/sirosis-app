import NetInfo from '@react-native-community/netinfo';

import { DEFAULT_API_TIMEOUT_MS, getApiBaseUrl } from './config';
import { ApiError, isApiError } from './errors';

export interface PostJsonOptions {
  timeoutMs?: number;
  skipNetworkCheck?: boolean;
}

export async function postJson<TReq, TRes>(
  endpoint: string,
  payload: TReq,
  options: PostJsonOptions = {}
): Promise<TRes> {
  const { timeoutMs = DEFAULT_API_TIMEOUT_MS, skipNetworkCheck = false } =
    options;

  if (!skipNetworkCheck) {
    const netState = await NetInfo.fetch();
    if (netState.isConnected === false) {
      throw new ApiError('OFFLINE', 'No active internet connection.');
    }
  }

  const baseUrl = getApiBaseUrl();
  const normalizedEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;
  const url = `${baseUrl}${normalizedEndpoint}`;

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    let parsed: unknown;
    try {
      parsed = await response.json();
    } catch {
      throw new ApiError(
        'PARSE',
        `Invalid JSON response from server (HTTP ${response.status}).`,
        response.status
      );
    }

    if (!response.ok) {
      const serverMsg =
        typeof parsed === 'object' &&
        parsed !== null &&
        'error' in parsed &&
        typeof (parsed as { error?: unknown }).error === 'string'
          ? (parsed as { error: string }).error
          : `Request failed with status ${response.status}`;

      if (response.status === 401) {
        throw new ApiError('UNAUTHORIZED', serverMsg, 401);
      }
      throw new ApiError('SERVER', serverMsg, response.status);
    }

    return parsed as TRes;
  } catch (error: unknown) {
    if (isApiError(error)) {
      throw error;
    }
    if (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      (error as { name?: string }).name === 'AbortError'
    ) {
      throw new ApiError(
        'TIMEOUT',
        `Request to ${normalizedEndpoint} timed out after ${timeoutMs}ms.`
      );
    }
    const message =
      error instanceof Error ? error.message : 'Network request failed.';
    throw new ApiError('NETWORK', message);
  } finally {
    clearTimeout(timeoutHandle);
  }
}
