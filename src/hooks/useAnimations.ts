import { useSharedValue, withTiming, withRepeat, withSequence } from 'react-native-reanimated';
import { useEffect } from 'react';
import { CONSTANTS } from '../utils/constants';

export const useAnimations = (isPlaying: boolean) => {
    const translateY = useSharedValue(CONSTANTS.SCREEN_HEIGHT);
    const playButtonScale = useSharedValue(1);
    const heartScale = useSharedValue(1);

    // Equalizer bars
    const eqBar1 = useSharedValue(0.3);
    const eqBar2 = useSharedValue(0.6);
    const eqBar3 = useSharedValue(0.4);
    const eqBar4 = useSharedValue(0.8);

    // Initial animation
    useEffect(() => {
        translateY.value = withTiming(CONSTANTS.SCREEN_HEIGHT - CONSTANTS.MINI_PLAYER_HEIGHT, {
            duration: 500
        });
    }, []);

    // Equalizer animations
    useEffect(() => {
        const createEqAnimation = () =>
            withRepeat(
                withSequence(
                    withTiming(Math.random() * 0.7 + 0.3, { duration: 250 }),
                    withTiming(Math.random() * 0.7 + 0.3, { duration: 300 })
                ), -1, true
            );

        if (isPlaying) {
            eqBar1.value = createEqAnimation();
            eqBar2.value = createEqAnimation();
            eqBar3.value = createEqAnimation();
            eqBar4.value = createEqAnimation();
        } else {
            [eqBar1, eqBar2, eqBar3, eqBar4].forEach(bar =>
                bar.value = withTiming(bar.value, { duration: 200 })
            );
        }
    }, [isPlaying]);

    const animatePlayButton = () => {
        playButtonScale.value = withSequence(
            withTiming(0.85, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );
    };

    const animateHeart = () => {
        heartScale.value = withSequence(
            withTiming(1.3, { duration: 150 }),
            withTiming(1, { duration: 150 })
        );
    };

    return {
        translateY,
        playButtonScale,
        heartScale,
        eqBar1,
        eqBar2,
        eqBar3,
        eqBar4,
        animatePlayButton,
        animateHeart,
    };
};