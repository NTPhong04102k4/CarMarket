import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { createStackNavigator } from '@react-navigation/stack';
import TimeSelect from '@/screens/TimeSelect';
import { Paths } from './paths';
import WidgetConfig from '@/screens/WidgetConfig';
import WidgetButtonScreen from '@/screens/WidgetButtonScreen';

function ApplicationNavigator() {
  const { navigationTheme } = useTheme();

  const Stack = createStackNavigator();

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={Paths.TimeSelect}
        >
          <Stack.Screen name={Paths.TimeSelect} component={TimeSelect} />
          <Stack.Screen name={Paths.WidgetConfig} component={WidgetConfig} />
          <Stack.Screen
            name={Paths.WidgetButtonScreen}
            component={WidgetButtonScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
