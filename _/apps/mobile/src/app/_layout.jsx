import { useAuth } from '@/utils/auth/useAuth';
import { useAuthStore } from '@/utils/auth/store';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppState, View } from 'react-native';
import { ThemeProvider } from '@/utils/ThemeProvider';
import { restoreDailyNotification } from '@/utils/notifications';
import { initializeMobileAds } from '@/utils/mobileAds';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const { initiate, isReady } = useAuth();

  useEffect(() => {
    initiate();
  }, [initiate]);

  // Safety timeout — forces ready after 5s if auth hangs
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!useAuthStore.getState().isReady) {
        console.warn('Auth initiation timed out, forcing ready state');
        useAuthStore.setState({ auth: null, isReady: true });
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    initializeMobileAds().catch((error) => {
      console.error('Unable to initialize mobile ads:', error);
    });
  }, []);

  useEffect(() => {
    if (!isReady) return undefined;

    const restoreReminder = () => {
      restoreDailyNotification().catch((error) => {
        console.error('Unable to restore daily reminder:', error);
      });
    };

    restoreReminder();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') restoreReminder();
    });
    return () => subscription.remove();
  }, [isReady]);

  if (!isReady) {
    return <View style={{ flex: 1, backgroundColor: '#ffffff' }} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}