import { BookOpen, HeartPulse, Hospital, Pill, type LucideIcon } from 'lucide-react-native';

export type AppDestinationKey = 'index' | 'los' | 'dose' | 'info';

export interface AppDestination {
  key: AppDestinationKey;
  label: string;
  accessibilityLabel: string;
  headerTitle: string;
  icon: LucideIcon;
}

export const APP_DESTINATIONS: AppDestination[] = [
  {
    key: 'index',
    label: 'Mortalitas',
    accessibilityLabel: 'Tab Prediksi Mortalitas',
    headerTitle: 'AI Prediksi Mortalitas',
    icon: HeartPulse,
  },
  {
    key: 'los',
    label: 'Lama Rawat',
    accessibilityLabel: 'Tab Prediksi Lama Rawat',
    headerTitle: 'AI Prediksi Lama Rawat',
    icon: Hospital,
  },
  {
    key: 'dose',
    label: 'Dosis',
    accessibilityLabel: 'Tab Rekomendasi Dosis Klinis',
    headerTitle: 'Rekomendasi Dosis Klinis',
    icon: Pill,
  },
  {
    key: 'info',
    label: 'Info',
    accessibilityLabel: 'Tab Informasi dan Metodologi Riset',
    headerTitle: 'Info & Metodologi',
    icon: BookOpen,
  },
];
