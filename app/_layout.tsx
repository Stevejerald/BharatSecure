import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // For demo purposes, we'll check if user has completed login
      // In a real app, you'd check for a valid token or user session
      const hasLoggedIn = await AsyncStorage.getItem('hasLoggedIn');
      setIsAuthenticated(hasLoggedIn === 'true');
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Periodic check for auth status changes to handle logout
  useEffect(() => {
    const interval = setInterval(() => {
      checkAuthStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="login"
          redirect={isAuthenticated}
        />
        <Stack.Screen
          name="security-check"
          redirect={isAuthenticated}
        />
        <Stack.Screen
          name="verification"
          redirect={isAuthenticated}
        />
        <Stack.Screen
          name="(tabs)"
          redirect={!isAuthenticated}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
