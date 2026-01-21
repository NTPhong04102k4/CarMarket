import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import notifee, {
  EventType,
  AndroidNotificationSetting,
} from '@notifee/react-native';

import {
  createSnoozeNotification,
  displayImmediateNotification,
  getPendingNotifications,
  cancelAllNotifications,
  NOTIFICATION_CHANNELS,
} from '@/services/notification/notificationService';

export const useNotificationEvents = () => {
  const [notificationEvents, setNotificationEvents] = useState<string[]>([]);
  const [pendingNotifications, setPendingNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      const eventMessage = `Foreground Event: ${type}`;
      setNotificationEvents((prev) => [eventMessage, ...prev.slice(0, 4)]);

      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          Alert.alert('Thông báo', 'Bạn đã từ chối thông báo');
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          Alert.alert('Thông báo', 'Bạn đã nhấn vào thông báo!');
          break;
        case EventType.ACTION_PRESS:
          console.log('User pressed action', detail.pressAction);
          console.log('Action ID:', detail.pressAction?.id);
          if (detail.pressAction?.id === 'snooze') {
            console.log('Snooze action detected, handling...');
            handleSnoozeNotification(detail.notification);
          } else {
            console.log('Action not recognized:', detail.pressAction?.id);
          }
          break;
        case EventType.DELIVERED:
          console.log('Notification delivered', detail.notification);
          break;
      }
    });

    return unsubscribe;
  }, []);

  const handleSnoozeNotification = async (notification: any) => {
    try {
      console.log('Handling snooze for notification:', notification);
      await notifee.cancelNotification(notification.id);
      await createSnoozeNotification(
        notification,
        2, // snoozeMinutes
        'Đã hoãn thông báo 2 phút', // body
        'Chậm 2 phút', // title
        'Hoãn 2 phút', // titleSnooze
        'Từ chối', // titleDismiss
        NOTIFICATION_CHANNELS.SNOOZE_REMINDER, // channelId
      );
      Alert.alert('Thông báo', 'Đã hoãn thông báo 2 phút');
    } catch (error) {
      console.error('Error snoozing notification:', error);
      Alert.alert('Lỗi', 'Không thể hoãn thông báo. Vui lòng thử lại.');
    }
  };

  const displayTestNotification = async () => {
    try {
      // Kiểm tra quyền thông báo
      const settings = await notifee.getNotificationSettings();
      console.log('Notification settings:', settings);

      if (settings.android?.alarm === AndroidNotificationSetting.DISABLED) {
        Alert.alert(
          'Quyền thông báo',
          'Ứng dụng cần quyền tạo thông báo chính xác. Vui lòng cấp quyền trong cài đặt.',
          [
            { text: 'Hủy', style: 'cancel' },
            {
              text: 'Cài đặt',
              onPress: () => notifee.openAlarmPermissionSettings(),
            },
          ],
        );
        return;
      }

      await displayImmediateNotification(
        'Test Thông Báo ngay lập tức',
        'Đây là thông báo test với các tùy chọn',
        'test-notification-id', // notificationId
        'Hoãn 5 phút', // titleSnooze
        'Từ chối', // titleDismiss
        NOTIFICATION_CHANNELS.TEST_NOTIFICATION, // channelId
      );
      Alert.alert('Thành công', 'Đã gửi thông báo test!');
    } catch (error) {
      console.error('Error displaying notification:', error);
      Alert.alert('Lỗi', 'Không thể gửi thông báo test. Vui lòng thử lại.');
    }
  };

  const checkPendingNotifications = async () => {
    try {
      const notifications = await getPendingNotifications();
      setPendingNotifications(notifications);
      Alert.alert(
        'Thông báo đang chờ',
        `Có ${notifications.length} thông báo đang chờ`,
      );
    } catch (error) {
      console.error('Error checking pending notifications:', error);
      Alert.alert('Lỗi', 'Không thể kiểm tra thông báo đang chờ.');
    }
  };

  const autoScheduleNotification = async () => {
    try {
      setIsLoading(true);
      const settings = await notifee.getNotificationSettings();
      if (settings.android?.alarm === AndroidNotificationSetting.DISABLED) {
        Alert.alert(
          'Quyền thông báo',
          'Ứng dụng cần quyền tạo thông báo chính xác để lên lịch nhắc nhở. Vui lòng cấp quyền trong cài đặt.',
          [
            { text: 'Hủy', style: 'cancel' },
            {
              text: 'Cài đặt',
              onPress: () => notifee.openAlarmPermissionSettings(),
            },
          ],
        );
        return;
      }
    } catch (error) {
      console.error('Error scheduling evening notification:', error);
      Alert.alert('Lỗi', 'Không thể lên lịch thông báo. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAllNotifications = async () => {
    try {
      setIsLoading(true);
      await cancelAllNotifications();
      Alert.alert('Thành công', 'Đã hủy tất cả thông báo!');
    } catch (error) {
      console.error('Error cancelling notifications:', error);
      Alert.alert('Lỗi', 'Không thể hủy thông báo. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    notificationEvents,
    pendingNotifications,
    isLoading,
    displayTestNotification,
    checkPendingNotifications,
    autoScheduleNotification,
    handleCancelAllNotifications,
  };
};
