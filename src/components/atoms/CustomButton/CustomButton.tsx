import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'info';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Text style={buttonTextStyle}>{loading ? 'Đang xử lý...' : title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Primary variant
  primary: {
    backgroundColor: '#4CAF50',
  },
  primaryText: {
    color: 'white',
  },
  // Secondary variant
  secondary: {
    backgroundColor: '#2196F3',
  },
  secondaryText: {
    color: 'white',
  },
  // Danger variant
  danger: {
    backgroundColor: '#F44336',
  },
  dangerText: {
    color: 'white',
  },
  // Warning variant
  warning: {
    backgroundColor: '#FF9800',
  },
  warningText: {
    color: 'white',
  },
  // Info variant
  info: {
    backgroundColor: '#607D8B',
  },
  infoText: {
    color: 'white',
  },
  // Disabled state
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.8,
  },
});

export default CustomButton;
