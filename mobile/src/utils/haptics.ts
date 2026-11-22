import * as Haptics from 'expo-haptics';

export async function triggerSuccessHaptic(): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Ignore on simulators/test runtimes without haptics hardware
  }
}

export async function triggerErrorHaptic(): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch {
    // Ignore on simulators/test runtimes without haptics hardware
  }
}
