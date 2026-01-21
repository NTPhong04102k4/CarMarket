import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import { CustomButton, CustomText } from '@/components/atoms';
import TimeDisplay from './Item/TimeDisplay';
import AlternativeTimeDisplay from './Item/AlternativeTimeDisplay';
import { useNotificationEvents } from '@/screens/TimeSelect/useNotificationEvents';
import {
  NOTIFICATION_CHANNELS,
  scheduleDailyNotifications,
} from '@/services/notification/notificationService';
import { Paths } from '@/navigation/paths';

function TimeSelect() {
  const navigation = useNavigation();
  const {
    displayTestNotification,
    checkPendingNotifications,
    handleCancelAllNotifications,
  } = useNotificationEvents();

  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [timeSetting] = useState({
    timezone: 'UTC+7',
  });
  const [notifications] = useState({
    enabled: true,
  });
  const getCurrentTime = () => {
    const now = new Date();
    setSelectedTime(now);
  };

  const orderNotification = async () => {
    try {
      await scheduleDailyNotifications(
        selectedTime,
        'Đây là thông báo nhắc nhở hàng ngày!',
        'Nhắc nhở lúc 11:17',
        NOTIFICATION_CHANNELS.DAILY_REMINDER,
        'Hoãn 5 phút',
        'Từ chối',
      );
    } catch (error) {
      console.error('Error ordering notification:', error);
    }
  };
  const onTimeChange = (event: any, date?: Date) => {
    setShowPicker(false);
    if (date) {
      setSelectedTime(date);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomText variant="title">Chọn Thời Gian</CustomText>
      {/* Hiển thị thời gian đã chọn */}
      <TimeDisplay
        selectedTime={selectedTime}
        timezone={timeSetting.timezone}
      />

      {/* Hiển thị thời gian ở múi giờ khác */}
      <AlternativeTimeDisplay
        selectedTime={selectedTime}
        timezone={timeSetting.timezone}
      />

      {/* Nút mở time picker */}
      <CustomButton
        title="Chọn Thời Gian"
        onPress={() => setShowPicker(true)}
        variant="primary"
      />

      {/* Nút lấy thời gian hiện tại */}
      <CustomButton
        title="Lấy Thời Gian Hiện Tại"
        onPress={getCurrentTime}
        variant="warning"
      />

      {/* Nút đặt thông báo */}
      <CustomButton
        title="Đặt Thông Báo"
        onPress={orderNotification}
        variant={notifications.enabled ? 'primary' : 'secondary'}
      />

      {/* Nút tắt thông báo */}
      {notifications.enabled && (
        <CustomButton
          title="Tắt Thông Báo"
          onPress={handleCancelAllNotifications}
          variant="danger"
        />
      )}

      {/* Nút test thông báo */}
      <CustomButton
        title="Test Thông Báo"
        onPress={displayTestNotification}
        variant="info"
      />

      {/* Nút kiểm tra thông báo đang chờ */}
      <CustomButton
        title="Kiểm Tra Thông Báo Đang Chờ"
        onPress={checkPendingNotifications}
        variant="info"
      />

      {/* Nút chuyển đến Widget Config */}
      <CustomButton
        title="Cấu Hình Widget"
        onPress={() => navigation.navigate(Paths.WidgetConfig as never)}
        variant="primary"
      />

      {/* Time Picker */}
      {showPicker && (
        <DateTimePicker
          display="default"
          is24Hour
          mode="time"
          onChange={(event, date) => onTimeChange(event, date || selectedTime)}
          testID="dateTimePicker"
          value={selectedTime}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
});

export default TimeSelect;
