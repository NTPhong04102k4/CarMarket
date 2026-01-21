import './react-native-reanimated';
import './react-native-safe-area-context';

// Mock for @notifee/react-native
jest.mock('@notifee/react-native', () => ({
  default: {
    cancelAllNotifications: jest.fn(),
    cancelNotification: jest.fn(),
    createChannel: jest.fn(),
    createTriggerNotification: jest.fn(),
    displayNotification: jest.fn(),
    getInitialNotification: jest.fn(),
    onBackgroundEvent: jest.fn(),
    onForegroundEvent: jest.fn(),
    requestPermission: jest.fn(),
  },
  EventType: {
    ACTION_PRESS: 'action_press',
    DISMISSED: 'dismissed',
    PRESS: 'press',
  },
  RepeatFrequency: {
    DAILY: 'daily',
  },
  TriggerType: {
    TIMESTAMP: 'timestamp',
  },
}));
