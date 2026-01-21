import notifee, { EventType, TriggerType } from '@notifee/react-native';
import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import App from './src/App';

if (__DEV__) {
  void import('@/reactotron.config');
}
notifee.onBackgroundEvent(async ({ detail, type }) => {
  const { notification, pressAction } = detail;

  // Check if the user pressed the "Mark as read" action
  if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
    // Update external API
    await global.fetch(
      `https://my-api.com/chat/${String(notification.data.chatId)}/read`,
      {
        method: 'POST',
      },
    );

    // Remove the notification
    await notifee.cancelNotification(notification.id);
  }

  // Handle snooze action
  if (type === EventType.ACTION_PRESS && pressAction.id === 'snooze') {
    try {
      // Cancel the current notification
      await notifee.cancelNotification(notification.id);

      // Create a new notification in 5 minutes
      const snoozeTime = new Date(Date.now() + 5 * 60 * 1000);

      await notifee.createTriggerNotification(
        {
          android: {
            channelId: 'snooze_reminder',
            smallIcon: 'ic_launcher',
            pressAction: {
              id: 'main_action',
            },
            actions: [
              {
                pressAction: {
                  id: 'snooze',
                },
                title: 'Hoãn 5 phút',
              },
              {
                pressAction: {
                  id: 'dismiss',
                },
                title: 'Từ chối',
              },
            ],
          },
          body: 'Thông báo đã được hoãn 5 phút',
          title: 'Nhắc nhở (Đã hoãn)',
        },
        {
          timestamp: snoozeTime.getTime(),
          type: TriggerType.TIMESTAMP,
        },
      );
    } catch (error) {
      console.error('Error handling snooze in background:', error);
    }
  }

  // Handle dismiss action
  if (type === EventType.ACTION_PRESS && pressAction.id === 'dismiss') {
    try {
      await notifee.cancelNotification(notification.id);
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  }
});
AppRegistry.registerComponent(appName, () => App);
