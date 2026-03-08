import { useAuth } from '@/utils/auth/useAuth';
import { useAuthStore } from '@/utils/auth/store';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View } from 'react-native';

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
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return <View style={{ flex: 1, backgroundColor: '#ffffff' }} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}