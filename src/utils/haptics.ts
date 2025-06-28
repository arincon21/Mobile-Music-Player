import * as Haptics from 'expo-haptics';

export const triggerHapticFeedback = (
    style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light
) => {
    Haptics.impactAsync(style);
};