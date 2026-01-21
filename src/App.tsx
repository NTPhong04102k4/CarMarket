import 'react-native-gesture-handler';

import notifee, { EventType } from '@notifee/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MMKV } from 'react-native-mmkv';
import { Provider } from 'react-redux';

import ApplicationNavigator from '@/navigation/Application';
import { ThemeProvider } from '@/theme';
import '@/translations';
import { initializeNotificationChannels } from './services/notification/helperNotification';
import { NativeModules } from 'react-native';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});
const group = 'group.streak';

const SharedStorage = NativeModules.SharedStorage;
export const storage = new MMKV();

function App() {
  const [loading, setLoading] = useState(true);

  // Bootstrap sequence function
  async function bootstrap() {
    // Khởi tạo notification channels
    await initializeNotificationChannels();
    const initialNotification = await notifee.getInitialNotification();

    if (initialNotification) {
      console.log(
        'Notification caused application to open',
        initialNotification.notification,
      );
      console.log(
        'Press action used to open the app',
        initialNotification.pressAction,
      );
    }
  }

  useEffect(() => {
    bootstrap()
      .then(() => {
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    return notifee.onForegroundEvent(({ type }) => {
      switch (type) {
        case EventType.DISMISSED: {
          // console.log('User dismissed notification', detail.notification);
          break;
        }
        case EventType.PRESS: {
          // console.log('User pressed notification', detail.notification);
          break;
        }
      }
    });
  }, []);

  if (loading) {
    return undefined;
  }
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider storage={storage}>
          <ApplicationNavigator />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default App;
