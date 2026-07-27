import React from 'react';
import { AuthProvider } from './src/store/AuthContext';
import { DataProvider } from './src/store/DataContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppNavigator />
      </DataProvider>
    </AuthProvider>
  );
}
