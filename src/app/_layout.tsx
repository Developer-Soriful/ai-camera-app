import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { AdjustmentProvider } from '../features/editor/context/AdjustmentContext';
import { ToastPill } from '../ui/primitives/ToastPill';
import { useCameraSessionStore } from '../features/camera/store/useCameraSessionStore';
import { colors } from '../ui/theme/tokens';

export default function RootLayout() {
  const toastMessage = useCameraSessionStore((s) => s.toastMessage);
  const clearToast = useCameraSessionStore((s) => s.clearToast);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <AdjustmentProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              contentStyle: { backgroundColor: colors.canvas },
            }}
          />
          <ToastPill message={toastMessage} onDismiss={clearToast} />
        </AdjustmentProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
});
