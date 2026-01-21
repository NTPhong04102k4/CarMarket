import React from 'react';
import { StyleSheet } from 'react-native';
import moment from 'moment';

import CustomCard from '@/components/atoms/CustomCard/CustomCard';
import CustomText from '@/components/atoms/CustomText/CustomText';

interface AlternativeTimeDisplayProps {
  selectedTime: Date;
  timezone: string;
}

const AlternativeTimeDisplay: React.FC<AlternativeTimeDisplayProps> = ({
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

  const alternativeTimezone = timezone === 'UTC+7' ? 'UTC' : 'UTC+7';

  return (
    <CustomCard style={styles.alternativeTime}>
      <CustomText variant="caption" color="secondary" style={styles.label}>
        Tương ứng với {alternativeTimezone}:
      </CustomText>
      <CustomText variant="body" style={styles.value}>
        {formatDate(selectedTime, alternativeTimezone)} -{' '}
        {formatTime(selectedTime, alternativeTimezone)}
      </CustomText>
    </CustomCard>
  );
};

const styles = StyleSheet.create({
  alternativeTime: {
    backgroundColor: '#E3F2FD',
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
  },
  value: {
    color: '#1976D2',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AlternativeTimeDisplay;
