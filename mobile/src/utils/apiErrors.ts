import { isApiError } from '@/services/api';

type TranslateFn = (key: string) => string;

export function getApiErrorMessage(error: unknown, t: TranslateFn): string {
  if (isApiError(error)) {
    switch (error.code) {
      case 'OFFLINE':
        return t('errors.offline');
      case 'TIMEOUT':
        return t('errors.timeout');
      case 'UNAUTHORIZED':
        return error.message || t('errors.unauthorized');
      case 'CONFIG':
        return t('errors.config');
      case 'PARSE':
        return t('errors.parse');
      case 'SERVER':
        return error.message || t('errors.server');
      case 'NETWORK':
      default:
        return t('errors.network');
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return t('errors.network');
}
