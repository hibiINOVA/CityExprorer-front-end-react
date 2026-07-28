import React from 'react';
import { LogBox } from 'react-native';
import { AuthProvider } from './src/store/AuthContext';
import { DataProvider } from './src/store/DataContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';

// Capturar promesas no manejadas para debugging
if (global?.ErrorUtils?.setGlobalHandler) {
  const origHandler = global.ErrorUtils.getGlobalHandler();
  global.ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error('[GlobalError]', error?.message, error?.stack);
    if (typeof origHandler === 'function') origHandler(error, isFatal);
  });
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <AppNavigator />
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
