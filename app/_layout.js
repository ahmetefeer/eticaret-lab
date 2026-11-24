import React from 'react';
import { Stack } from 'expo-router';
import { SepetProvider } from '../context/SepetContext';

export default function RootLayout() {
  return (
    <SepetProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#111827',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#f3f4f6' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Ürünler' }} />
        <Stack.Screen name="urun/[id]" options={{ title: 'Ürün Detayı' }} />
        <Stack.Screen name="sepet" options={{ title: 'Sepetim' }} />
      </Stack>
    </SepetProvider>
  );
}
