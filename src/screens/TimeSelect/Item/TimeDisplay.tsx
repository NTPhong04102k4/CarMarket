import React from 'react';
import { View, StyleSheet } from 'react-native';
import moment from 'moment';

import CustomCard from '@/components/atoms/CustomCard/CustomCard';
import CustomText from '@/components/atoms/CustomText/CustomText';

interface TimeDisplayProps {
  selectedTime: Date;
  timezone: string;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  selectedTime,
  timezone,
}) => {
  // Chuyển đổi thời gian theo múi giờ
  const getTimeInTimezone = (date: Date, timezone: string) => {
    return timezone === 'UTC+7'
      ? moment(date).utcOffset('+07:00')
      : moment(date).utc();
  };

  // Hiển thị thời gian đã format
  const formatTime = (date: Date, timezone: string) => {
    const momentTime = getTimeInTimezone(date, timezone);
    return momentTime.format('HH:mm:ss');
  };

  // Hiển thị ngày đã format
  const formatDate = (date: Date, timezone: string) => {
    const momentTime = getTimeInTimezone(date, timezone);
    return momentTime.format('DD/MM/YYYY');
  };

  return (
    <CustomCard style={styles.timeDisplay}>
      <CustomText variant="label" color="secondary">
        Thời gian đã chọn:
      </CustomText>
      <CustomText variant="heading" style={styles.timeValue}>
        {formatDate(selectedTime, timezone)} -{' '}
        {formatTime(selectedTime, timezone)}
      </CustomText>
      <CustomText variant="caption" color="info" style={styles.timezoneText}>
        ({timezone})
      </CustomText>
    </CustomCard>
  );
};

const styles = StyleSheet.create({
  timeDisplay: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  timeValue: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
  timezoneText: {
    marginTop: 5,
  },
});

export default TimeDisplay;
