import notifee, {
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
  AndroidImportance,
} from '@notifee/react-native';

// Định nghĩa các channel constants
export const NOTIFICATION_CHANNELS = {
  DAILY_REMINDER: 'daily_reminder',
  SNOOZE_REMINDER: 'snooze_reminder',
  TEST_NOTIFICATION: 'test_notification',
  IMMEDIATE_NOTIFICATION: 'immediate_notification',
  CANCEL: 'cancel',
  MAIN_ACTION: 'main_action',
};

export type NotificationChannelType =
  (typeof NOTIFICATION_CHANNELS)[keyof typeof NOTIFICATION_CHANNELS];

// Hàm tạo tất cả channels khi khởi động app
export async function createAllNotificationChannels() {
  try {
    // Channel cho thông báo hàng ngày
    await notifee.createChannel({
      id: NOTIFICATION_CHANNELS.DAILY_REMINDER,
      name: 'Nhắc nhở hàng ngày',
      sound: 'default',
      importance: AndroidImportance.HIGH,
      description: 'Thông báo hàng ngày với độ ưu tiên cao',
    });

    // Channel cho thông báo hoãn
    await notifee.createChannel({
      id: NOTIFICATION_CHANNELS.SNOOZE_REMINDER,
      name: 'Nhắc nhở hoãn',
      sound: 'default',
      description: 'Thông báo hoãn với độ ưu tiên trung bình',
      importance: AndroidImportance.DEFAULT,
    });

    // Channel cho thông báo test
    await notifee.createChannel({
      id: NOTIFICATION_CHANNELS.TEST_NOTIFICATION,
      name: 'Thông báo test',
      sound: 'default',
      description: 'Thông báo test với độ ưu tiên thấp',
      importance: AndroidImportance.LOW,
    });

    // Channel cho thông báo ngay lập tức
    await notifee.createChannel({
      id: NOTIFICATION_CHANNELS.IMMEDIATE_NOTIFICATION,
      name: 'Thông báo ngay lập tức',
      sound: 'default',
      description: 'Thông báo ngay lập tức với độ ưu tiên cao',
      importance: AndroidImportance.HIGH,
    });

    console.log('All notification channels created successfully');
  } catch (error) {
    console.error('Error creating notification channels:', error);
    throw error;
  }
}

// Hàm tạo channel cho Android (giữ lại để backward compatibility)
export async function createNotificationChannel(
  channelId: string = 'default',
  channelName: string = 'Default Channel',
  importance: number = 4,
  sound: string = 'default',
) {
  try {
    const channel = await notifee.createChannel({
      id: channelId,
      name: channelName,
      sound,
      importance,
    });
    console.log(`Channel created: ${channel}`);
    return channel;
  } catch (error) {
    console.error('Error creating channel:', error);
    throw error;
  }
}

// Hàm cập nhật thông báo
export async function updateNotification(
  notificationId: string,
  title: string,
  body: string,
  channelId: string = 'default',
  titleSnooze?: string,
  titleDismiss?: string,
) {
  try {
    await notifee.displayNotification({
      id: notificationId,
      title,
      body,
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        pressAction: {
          id: NOTIFICATION_CHANNELS.MAIN_ACTION,
        },
        actions: [
          {
            pressAction: {
              id: 'snooze',
            },
            title: titleSnooze || 'Hoãn 5 phút',
          },
          {
            pressAction: {
              id: 'dismiss',
            },
            title: titleDismiss || 'Từ chối',
          },
        ],
      },
    });
    console.log(`Notification ${notificationId} updated successfully`);
  } catch (error) {
    console.error('Error updating notification:', error);
    throw error;
  }
}

// Hàm hủy thông báo cụ thể
export async function cancelNotification(notificationId: string) {
  try {
    await notifee.cancelNotification(notificationId);
    console.log(`Notification ${notificationId} cancelled successfully`);
  } catch (error) {
    console.error('Error cancelling notification:', error);
    throw error;
  }
}

export async function cancelAllNotifications() {
  try {
    await notifee.cancelAllNotifications();
    console.log('All notifications cancelled successfully');
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
    throw error;
  }
}

// tạo notification với ID tùy chỉnh
export async function scheduleNotification(
  date: string,
  title: string,
  body: string,
  trigger: TimestampTrigger,
  notificationId?: string,
  repeatFrequency?: RepeatFrequency,
  alarmManager?: boolean,
  channelId?: string,
  titleSnooze?: string,
  titleDismiss?: string,
) {
  try {
    // Đảm bảo có ID hợp lệ cho notification
    const validNotificationId = notificationId || `scheduled-${Date.now()}`;

    await notifee.createTriggerNotification(
      {
        id: validNotificationId,
        android: {
          channelId: channelId || NOTIFICATION_CHANNELS.DAILY_REMINDER,
          smallIcon: 'ic_launcher',
          pressAction: {
            id: NOTIFICATION_CHANNELS.MAIN_ACTION,
          },
          actions: [
            {
              pressAction: {
                id: 'snooze',
              },
              title: titleSnooze || 'Hoãn 5 phút',
            },
            {
              pressAction: {
                id: 'dismiss',
              },
              title: titleDismiss || 'Từ chối',
            },
          ],
        },
        body,
        title,
      },
      trigger,
    );
    console.log('Notification scheduled successfully');
  } catch (error) {
    console.error('Error scheduling notification:', error);
    throw error;
  }
}

// Hàm lên lịch thông báo hàng ngày theo thời gian được chọn
export async function scheduleDailyNotifications(
  selectedTime?: Date,
  body?: string,
  title?: string,
  channelId?: NotificationChannelType,
  titleSnooze?: string,
  titleDismiss?: string,
) {
  try {
    // Request permissions first
    await notifee.requestPermission();

    // Sử dụng channel mặc định cho daily reminder
    const targetChannelId = channelId || NOTIFICATION_CHANNELS.DAILY_REMINDER;

    // Nếu không có selectedTime, sử dụng thời gian mặc định
    const targetTime = selectedTime || new Date();
    const hour = targetTime.getHours();
    const minute = targetTime.getMinutes();

    // Tạo trigger cho thời gian được chọn
    const trigger = getNextTrigger(hour, minute);

    console.log(
      `Scheduling daily notification for ${hour}:${minute} at ${new Date(trigger.timestamp).toLocaleString()} on channel: ${targetChannelId}`,
    );

    await notifee.createTriggerNotification(
      {
        id: 'daily-notification',
        android: {
          channelId: targetChannelId,
          smallIcon: 'ic_launcher',
          pressAction: {
            id: NOTIFICATION_CHANNELS.MAIN_ACTION,
          },
          actions: [
            {
              pressAction: {
                id: 'snooze',
              },
              title: titleSnooze || 'Hoãn 5 phút',
            },
            {
              pressAction: {
                id: 'dismiss',
              },
              title: titleDismiss || 'Từ chối',
            },
          ],
        },
        body: body || 'Đây là thông báo nhắc nhở hàng ngày!',
        title:
          title || `Nhắc nhở lúc ${hour}:${minute.toString().padStart(2, '0')}`,
      },
      trigger,
    );

    console.log('Daily notification scheduled successfully');
  } catch (error) {
    console.error('Error scheduling daily notifications:', error);
    throw error;
  }
}

// Hàm tạo thông báo snooze (hoãn) với ID tùy chỉnh
export async function createSnoozeNotification(
  originalNotification: any,
  snoozeMinutes: number = 5,
  body?: string,
  title?: string,
  titleSnooze?: string,
  titleDismiss?: string,
  channelId?: NotificationChannelType,
) {
  try {
    const snoozeTime = new Date(Date.now() + snoozeMinutes * 60 * 1000);
    const snoozeId = `snooze-${Date.now()}`; // Tạo ID duy nhất cho snooze

    // Sử dụng channel mặc định cho snooze notification
    const targetChannelId = channelId || NOTIFICATION_CHANNELS.SNOOZE_REMINDER;

    await notifee.createTriggerNotification(
      {
        id: snoozeId,
        android: {
          channelId: targetChannelId,
          smallIcon: 'ic_launcher',
          pressAction: {
            id: NOTIFICATION_CHANNELS.MAIN_ACTION,
          },
          actions: [
            {
              pressAction: {
                id: 'snooze',
              },
              title: titleSnooze || 'Hoãn 5 phút',
            },
            {
              pressAction: {
                id: 'dismiss',
              },
              title: titleDismiss || 'Từ chối',
            },
          ],
        },
        body: body || `Thông báo đã được hoãn ${snoozeMinutes} phút`,
        title: title || 'Nhắc nhở',
      },
      {
        timestamp: snoozeTime.getTime(),
        type: TriggerType.TIMESTAMP,
      },
    );

    console.log(
      `Snooze notification created for ${snoozeMinutes} minutes with ID: ${snoozeId} on channel: ${targetChannelId}`,
    );
    return snoozeId;
  } catch (error) {
    console.error('Error creating snooze notification:', error);
    throw error;
  }
}

// Hàm hiển thị thông báo ngay lập tức với ID tùy chỉnh
export async function displayImmediateNotification(
  body: string,
  title?: string,
  notificationId?: string,
  titleSnooze?: string,
  titleDismiss?: string,
  channelId?: NotificationChannelType,
) {
  try {
    // Request permissions first
    await notifee.requestPermission();

    // Sử dụng channel mặc định cho immediate notification
    const targetChannelId =
      channelId || NOTIFICATION_CHANNELS.IMMEDIATE_NOTIFICATION;

    // Đảm bảo có ID hợp lệ cho notification
    const validNotificationId = notificationId || `immediate-${Date.now()}`;

    const id = await notifee.displayNotification({
      id: validNotificationId,
      android: {
        channelId: targetChannelId,
        smallIcon: 'ic_launcher',
        pressAction: {
          id: NOTIFICATION_CHANNELS.MAIN_ACTION,
        },
        actions: [
          {
            pressAction: {
              id: 'snooze',
            },
            title: titleSnooze || 'Hoãn 5 phút',
          },
          {
            pressAction: {
              id: 'dismiss',
            },
            title: titleDismiss || 'Từ chối',
          },
        ],
      },
      body,
      title: title || 'Thông báo',
    });

    console.log(
      `Immediate notification displayed successfully with ID: ${id} on channel: ${targetChannelId}`,
    );
    return id;
  } catch (error) {
    console.error('Error displaying immediate notification:', error);
    throw error;
  }
}

// Hàm lấy danh sách thông báo đang chờ
export async function getPendingNotifications() {
  try {
    const notifications = await notifee.getTriggerNotifications();
    console.log('Pending notifications:', notifications);
    return notifications;
  } catch (error) {
    console.error('Error getting pending notifications:', error);
    throw error;
  }
}
function getNextTrigger(hour: number, minute: number): TimestampTrigger {
  const now = new Date();
  const target = new Date(now);
  target.setHours(hour, minute, 0, 0);
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  return {
    alarmManager: true, // Android: đảm bảo chính xác
    repeatFrequency: RepeatFrequency.DAILY,
    timestamp: target.getTime(),
    type: TriggerType.TIMESTAMP,
  };
}
