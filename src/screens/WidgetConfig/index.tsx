import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeModules,
  SafeAreaView,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  Dimensions,
  Alert,
  AppState,
} from 'react-native';
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import AwesomeButton from 'react-native-really-awesome-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { RootStackParamList } from '@/navigation/types';
import type { StackNavigationProp } from '@react-navigation/stack';

const group = 'group.streak';

const SharedStorage = NativeModules.SharedStorage;
const url =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWCFBWnaK-6QZev7Gdn7Nk3tnZForghHYhuQ&s';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const WidgetConfig = () => {
  const navigation = useNavigation<NavigationProp>();
  const [text, setText] = useState('');
  const [widgetSupported, setWidgetSupported] = useState<boolean>(false);
  const [existingWidgets, setExistingWidgets] = useState<number>(0);
  const [lastButtonClicked, setLastButtonClicked] = useState<number | null>(
    null,
  );
  const [pendingNavigation, setPendingNavigation] = useState<{
    screen: string;
    params: any;
  } | null>(null);

  const widgetData = {
    text,
    buttons: [
      { id: 1, text: 'Buy', action: 'buy' },
      { id: 2, text: 'Sell', action: 'sell' },
      { id: 3, text: 'Info', action: 'info' },
      { id: 4, text: 'Increase', action: 'increase' },
    ],
  };

  useEffect(() => {
    // Check widget support on component mount
    if (Platform.OS === 'android') {
      SharedStorage.checkWidgetSupport((isSupported: boolean) => {
        setWidgetSupported(isSupported);
      });

      SharedStorage.checkExistingWidgets((count: number) => {
        setExistingWidgets(count);
      });
    }

    // Listen for app state changes to detect when app is opened from widget
    const handleAppStateChange = (nextAppState: string) => {
      console.log('App state changed to:', nextAppState);
      if (nextAppState === 'active') {
        console.log('App became active, checking for widget button click');
        // Check if app was opened from widget button click
        if (Platform.OS === 'android') {
          SharedStorage.getLastButtonClick((buttonId: number) => {
            console.log('Retrieved button click:', buttonId);
            if (buttonId > 0) {
              setLastButtonClicked(buttonId);
              const buttonName = getButtonAction(buttonId);
              console.log('Button name:', buttonName);

              // Use requestAnimationFrame to ensure navigation is ready
              requestAnimationFrame(() => {
                if (buttonId === 1 || buttonId === 2 || buttonId === 3) {
                  console.log('Attempting to navigate to WidgetButtonScreen');
                  try {
                    if (navigation && navigation.navigate) {
                      navigation.navigate('WidgetButtonScreen', {
                        buttonName,
                      });
                      console.log(
                        'Successfully navigated to WidgetButtonScreen with buttonName:',
                        buttonName,
                      );
                    } else {
                      console.error(
                        'Navigation is not available, setting pending navigation',
                      );
                      setPendingNavigation({
                        screen: Paths.WidgetButtonScreen,
                        params: { buttonName },
                      });
                    }
                  } catch (error) {
                    console.error('Navigation error:', error);
                    console.log('Setting pending navigation as fallback');
                    setPendingNavigation({
                      screen: Paths.WidgetButtonScreen,
                      params: { buttonName },
                    });
                  }
                } else if (buttonId === 4) {
                  console.log('Button 4 clicked, showing alert');
                  Alert.alert(
                    'Widget Button Clicked',
                    `Button ${buttonId} was clicked! Action: ${buttonName}`,
                    [{ text: 'OK' }],
                  );
                }
              });
            }
          });
        }
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, [navigation]);

  // Handle pending navigation
  useEffect(() => {
    console.log('Pending navigation effect triggered:', pendingNavigation);
    if (pendingNavigation && navigation) {
      console.log('Attempting to execute pending navigation');
      try {
        navigation.navigate(
          pendingNavigation.screen as any,
          pendingNavigation.params,
        );
        console.log(
          'Successfully executed pending navigation to:',
          pendingNavigation.screen,
        );
        setPendingNavigation(null);
      } catch (error) {
        console.error('Error executing pending navigation:', error);
        setPendingNavigation(null);
      }
    }
  }, [pendingNavigation, navigation]);

  const getButtonAction = (buttonId: number): string => {
    switch (buttonId) {
      case 1:
        return 'Buy';
      case 2:
        return 'Sell';
      case 3:
        return 'Info';
      case 4:
        return 'Increase';
      default:
        return 'Unknown';
    }
  };

  const handleSubmit = async () => {
    let platform = Platform.select({
      ios: 'ios',
      android: 'android',
    });
    if (platform === 'ios') {
      try {
        // iOS
        await SharedGroupPreferences.setItem('widgetKey', widgetData, group);
      } catch (error) {
        console.log({ error });
      }
    } else {
      const value = `${text} days`;
      // Android
      const dataToSend = JSON.stringify({
        text: value,
        buttons: widgetData.buttons,
      });
      console.log('Sending data to widget:', dataToSend);
      SharedStorage.set(dataToSend);

      // Test retrieving data
      setTimeout(() => {
        SharedStorage.get((retrievedData: string) => {
          console.log('Retrieved data from SharedPreferences:', retrievedData);
        });
      }, 1000);

      ToastAndroid.show('Change value successfully!', ToastAndroid.SHORT);
    }
  };

  const handleAddWidget = () => {
    if (Platform.OS === 'android') {
      SharedStorage.addWidget((status: string, message: string) => {
        if (status === 'success') {
          Alert.alert('Success', 'Widget added to home screen!');
        } else {
          Alert.alert('Error', message || 'Failed to add widget');
        }
      });
    } else {
      Alert.alert('Info', 'Widget adding is only supported on Android');
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.heading}>Change Widget Value</Text>
          <View style={styles.bodyContainer}>
            <View style={styles.instructionContainer}>
              <View style={styles.thoughtContainer}>
                <Text style={styles.thoughtTitle}>
                  Enter the value that you want to display on your home widget
                </Text>
              </View>
              <View style={styles.thoughtPointer}></View>
              <Image source={{ uri: url }} style={styles.avatarImg} />
            </View>

            <TextInput
              style={styles.input}
              onChangeText={(newText) => setText(newText)}
              value={text}
              keyboardType="decimal-pad"
              placeholder="Enter the text to display..."
            />

            <AwesomeButton
              backgroundColor={'#33b8f6'}
              height={50}
              width={Dimensions.get('window').width}
              backgroundDarker={'#eeefef'}
              backgroundShadow={'#f1f1f0'}
              style={styles.actionButton}
              onPress={handleSubmit}
            >
              Submit
            </AwesomeButton>

            {Platform.OS === 'android' && widgetSupported && (
              <AwesomeButton
                backgroundColor={'#4CAF50'}
                height={50}
                width={Dimensions.get('window').width}
                backgroundDarker={'#45a049'}
                backgroundShadow={'#4CAF50'}
                style={[styles.actionButton, { marginTop: 20 }]}
                onPress={handleAddWidget}
              >
                Add Widget to Home Screen
              </AwesomeButton>
            )}

            {Platform.OS === 'android' && !widgetSupported && (
              <View style={styles.warningContainer}>
                <Text style={styles.warningText}>
                  Widget adding is not supported on this device
                </Text>
              </View>
            )}

            {Platform.OS === 'android' && existingWidgets > 0 && (
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  You have {existingWidgets} widget(s) on your home screen
                </Text>
              </View>
            )}

            {lastButtonClicked && (
              <View style={styles.buttonClickContainer}>
                <Text style={styles.buttonClickText}>
                  Last button clicked: {getButtonAction(lastButtonClicked)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default WidgetConfig;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fafaf3',
  },
  container: {
    flex: 1,
    width: '100%',
    // padding: 12,
  },
  heading: {
    fontSize: 24,
    color: '#979995',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    // fontSize: 20,
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#c6c6c6',
    borderRadius: 8,
    padding: 12,
  },
  bodyContainer: {
    flex: 1,
    // margin: 18,
  },
  instructionContainer: {
    margin: 25,
    paddingHorizontal: 20,
    paddingTop: 30,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#ecedeb',
    borderColor: '#bebfbd',
    marginBottom: 35,
  },
  avatarImg: {
    height: 180,
    width: 180,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
  },
  thoughtContainer: {
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    backgroundColor: '#ffffff',
    borderColor: '#c6c6c6',
  },
  thoughtPointer: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    overflow: 'hidden',
    borderTopWidth: 12,
    borderRightWidth: 10,
    borderBottomWidth: 0,
    borderLeftWidth: 10,
    borderTopColor: 'blue',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    marginTop: -1,
    marginLeft: '50%',
  },
  thoughtTitle: {
    fontSize: 14,
  },
  actionButton: {
    marginTop: 40,
    alignSelf: 'center',
  },
  warningContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeaa7',
    borderRadius: 8,
  },
  warningText: {
    color: '#856404',
    textAlign: 'center',
    fontSize: 14,
  },
  infoContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#d1ecf1',
    borderWidth: 1,
    borderColor: '#bee5eb',
    borderRadius: 8,
  },
  infoText: {
    color: '#0c5460',
    textAlign: 'center',
    fontSize: 14,
  },
  buttonClickContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#d4edda',
    borderWidth: 1,
    borderColor: '#c3e6cb',
    borderRadius: 8,
  },
  buttonClickText: {
    color: '#155724',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
