import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface CustomTextProps {
  children: React.ReactNode;
  variant?: 'title' | 'heading' | 'body' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  style?: TextStyle;
}

const CustomText: React.FC<CustomTextProps> = ({
  children,
  variant = 'body',
  color = 'primary',
  style,
}) => {
  const textStyle = [styles[variant], styles[color], style];

  return <Text style={textStyle}>{children}</Text>;
};

const styles = StyleSheet.create({
  // Variants
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  // Colors
  primary: {
    color: '#333',
  },
  secondary: {
    color: '#666',
  },
  success: {
    color: '#2E7D32',
  },
  warning: {
    color: '#E65100',
  },
  danger: {
    color: '#D32F2F',
  },
  info: {
    color: '#0277BD',
  },
});

export default CustomText;
