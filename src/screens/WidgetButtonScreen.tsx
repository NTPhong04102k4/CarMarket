import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';
import CustomText from '@/components/atoms/CustomText/CustomText';

const WidgetButtonScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'WidgetButtonScreen'>>();
  const { buttonName } = route.params;

  return (
    <View style={styles.container}>
      <CustomText style={styles.text}>
        chuyển màn sau khi ấn button {buttonName}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    color: '#333',
    fontSize: 22,
    textAlign: 'center',
  },
});

export default WidgetButtonScreen;
