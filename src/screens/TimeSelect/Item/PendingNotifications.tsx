import React from 'react';
import { StyleSheet } from 'react-native';

import CustomCard from '@/components/atoms/CustomCard/CustomCard';
import CustomText from '@/components/atoms/CustomText/CustomText';

interface PendingNotification {
  notification: {
    title: string;
  };
  trigger: {
    timestamp: number;
  };
}

interface PendingNotificationsProps {
  notifications: PendingNotification[];
}

const PendingNotifications: React.FC<PendingNotificationsProps> = ({
  notifications,
}) => {
  if (notifications.length === 0) return null;

  return (
    <CustomCard variant="info" style={styles.container}>
      <CustomText variant="heading" color="info" style={styles.title}>
        Thông báo đang chờ ({notifications.length}):
      </CustomText>
      {notifications.map((notification, index) => (
        <CustomText
          key={index}
          variant="caption"
          color="info"
          style={styles.notificationText}
        >
          • {notification.notification.title} -{' '}
          {new Date(notification.trigger.timestamp).toLocaleString()}
        </CustomText>
      ))}
    </CustomCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  title: {
    marginBottom: 8,
  },
  notificationText: {
    marginBottom: 2,
  },
});

export default PendingNotifications;
