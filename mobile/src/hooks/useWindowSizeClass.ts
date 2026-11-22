import { useWindowDimensions } from 'react-native';

import {
  getWindowSizeClass,
  isWideWindowClass,
  type WindowSizeClass,
} from '@/theme/tokens';

export interface WindowSizeMetrics {
  width: number;
  height: number;
  sizeClass: WindowSizeClass;
  isCompact: boolean;
  isWide: boolean;
  isLandscape: boolean;
}

export function useWindowSizeClass(): WindowSizeMetrics {
  const { width, height } = useWindowDimensions();
  const sizeClass = getWindowSizeClass(width);
  const isWide = isWideWindowClass(sizeClass);

  return {
    width,
    height,
    sizeClass,
    isCompact: sizeClass === 'compact',
    isWide,
    isLandscape: width > height,
  };
}
