import { Dimensions, Platform, StatusBar } from 'react-native';

const { height } = Dimensions.get('window');

export const CONSTANTS = {
    SCREEN_HEIGHT: height,
    ANDROID_STATUS_BAR_HEIGHT: StatusBar.currentHeight || 24,
    IOS_STATUS_BAR_HEIGHT: 44,
    STATUS_BAR_HEIGHT: Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight || 24),
    MINI_PLAYER_HEIGHT: 180,
    TRACK_DURATION_SECONDS: 261,
};