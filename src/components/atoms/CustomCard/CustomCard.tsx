import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface CustomCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'info' | 'warning' | 'danger';
  style?: ViewStyle;
}

const CustomCard: React.FC<CustomCardProps> = ({
  children,
  variant = 'default',
  style,
}) => {
  const cardStyle = [styles.card, styles[variant], style];

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
  },
  default: {
    backgroundColor: 'white',
    borderLeftColor: '#E0E0E0',
  },
  success: {
    backgroundColor: '#E8F5E8',
    borderLeftColor: '#4CAF50',
  },
  info: {
    backgroundColor: '#E1F5FE',
    borderLeftColor: '#03A9F4',
  },
  warning: {
    backgroundColor: '#FFF3E0',
    borderLeftColor: '#FF9800',
  },
  danger: {
    backgroundColor: '#FFEBEE',
    borderLeftColor: '#F44336',
  },
});

export default CustomCard;
