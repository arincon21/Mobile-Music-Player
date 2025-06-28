import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue, withTiming, clamp, runOnJS } from 'react-native-reanimated';
import { CONSTANTS } from '../utils/constants';

interface UseGesturesProps {
    translateY: any;
    onExpand: () => void;
    onCollapse: () => void;
}

export const useGestures = ({ translateY, onExpand, onCollapse }: UseGesturesProps) => {
    const startY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            startY.value = translateY.value;
        })
        .onUpdate((event) => {
            const newY = startY.value + event.translationY;
            translateY.value = clamp(
                newY,
                CONSTANTS.STATUS_BAR_HEIGHT,
                CONSTANTS.SCREEN_HEIGHT - CONSTANTS.MINI_PLAYER_HEIGHT
            );
        })
        .onEnd((event) => {
            const goDown = event.velocityY > 500;
            const goUp = event.velocityY < -500;
            const shouldCollapse = translateY.value > CONSTANTS.SCREEN_HEIGHT * 0.4;

            if (goUp) {
                translateY.value = withTiming(CONSTANTS.STATUS_BAR_HEIGHT, { duration: 400 });
                runOnJS(onExpand)();
            } else if (goDown) {
                translateY.value = withTiming(CONSTANTS.SCREEN_HEIGHT - CONSTANTS.MINI_PLAYER_HEIGHT, { duration: 400 });
                runOnJS(onCollapse)();
            } else {
                if (shouldCollapse) {
                    translateY.value = withTiming(CONSTANTS.SCREEN_HEIGHT - CONSTANTS.MINI_PLAYER_HEIGHT, { duration: 400 });
                    runOnJS(onCollapse)();
                } else {
                    translateY.value = withTiming(CONSTANTS.STATUS_BAR_HEIGHT, { duration: 400 });
                    runOnJS(onExpand)();
                }
            }
        });

    return { panGesture };
};