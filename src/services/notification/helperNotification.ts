import {
  createAllNotificationChannels,
  NOTIFICATION_CHANNELS,
} from './notificationService';

// Khởi tạo tất cả notification channels khi app khởi động
export const initializeNotificationChannels = async () => {
  try {
    await createAllNotificationChannels();
    console.log('All notification channels initialized successfully');
  } catch (error) {
    console.error('Error initializing notification channels:', error);
  }
};

// Hàm helper để lấy channel ID dựa trên loại thông báo
export const getChannelIdByType = (
  notificationType:
    | 'daily'
    | 'snooze'
    | 'test'
    | 'immediate'
    | 'cancel'
    | 'main_action'
    | 'dismiss',
) => {
  switch (notificationType) {
    case 'daily':
      return NOTIFICATION_CHANNELS.DAILY_REMINDER;
    case 'snooze':
      return NOTIFICATION_CHANNELS.SNOOZE_REMINDER;
    case 'test':
      return NOTIFICATION_CHANNELS.TEST_NOTIFICATION;
    case 'immediate':
      return NOTIFICATION_CHANNELS.IMMEDIATE_NOTIFICATION;
    case 'cancel':
      return NOTIFICATION_CHANNELS.CANCEL;
    case 'main_action':
      return NOTIFICATION_CHANNELS.MAIN_ACTION;
    case 'dismiss':
      return NOTIFICATION_CHANNELS.CANCEL;
    default:
      return NOTIFICATION_CHANNELS.IMMEDIATE_NOTIFICATION;
  }
};

// Hàm helper để kiểm tra xem channel có tồn tại không
export const validateChannelId = (channelId: string) => {
  const validChannels = Object.values(NOTIFICATION_CHANNELS);
  return validChannels.includes(channelId as any);
};

export const getChannelNameByType = (channelId: string) => {
  return NOTIFICATION_CHANNELS[channelId as keyof typeof NOTIFICATION_CHANNELS];
};

// Ví dụ về cách sử dụng các channel khác nhau cho từng loại thông báo
export const notificationChannelExamples = {
  // Thông báo hàng ngày - sử dụng channel DAILY_REMINDER
  dailyReminder: {
    channelId: NOTIFICATION_CHANNELS.DAILY_REMINDER,
    description: 'Thông báo nhắc nhở hàng ngày với độ ưu tiên cao',
    importance: 'HIGH',
  },

  // Thông báo hoãn - sử dụng channel SNOOZE_REMINDER
  snoozeReminder: {
    channelId: NOTIFICATION_CHANNELS.SNOOZE_REMINDER,
    description: 'Thông báo hoãn với độ ưu tiên trung bình',
    importance: 'DEFAULT',
  },

  // Thông báo test - sử dụng channel TEST_NOTIFICATION
  testNotification: {
    channelId: NOTIFICATION_CHANNELS.TEST_NOTIFICATION,
    description: 'Thông báo test với độ ưu tiên thấp',
    importance: 'LOW',
  },

  // Thông báo ngay lập tức - sử dụng channel IMMEDIATE_NOTIFICATION
  immediateNotification: {
    channelId: NOTIFICATION_CHANNELS.IMMEDIATE_NOTIFICATION,
    description: 'Thông báo hiển thị ngay lập tức',
    importance: 'DEFAULT',
  },
};
