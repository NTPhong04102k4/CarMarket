import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import CustomText from '@/components/atoms/CustomText/CustomText';

interface TimezoneSelectorProps {
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
}

const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  timezone,
  onTimezoneChange,
}) => {
  const handleTimezoneToggle = () => {
    const newTimezone = timezone === 'UTC+7' ? 'UTC' : 'UTC+7';
    onTimezoneChange(newTimezone);
  };

  return (
    <View style={styles.container}>
      <CustomText variant="body" color="secondary" style={styles.label}>
        Múi giờ hiện tại:
      </CustomText>
      <TouchableOpacity onPress={handleTimezoneToggle} style={styles.button}>
        <CustomText variant="body" style={styles.buttonText}>
          {timezone}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  label: {
    marginRight: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TimezoneSelector;
