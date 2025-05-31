import React from 'react';
import { useAuth } from '../../src/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { Redirect, useRootNavigationState } from 'expo-router'; 

// este componente es para proteger las rutas de la app, si el usuario no esta autenticado lo redirige a la pantalla de login
const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { authState } = useAuth();
  const rootNavigationState = useRootNavigationState();
 console.log("authState:", authState);
  if (!rootNavigationState?.key) {
    console.log("authState:", authState);
    return null;
  }

  if (authState?.authenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
  if (!authState?.authenticated) {
    return <Redirect href="../login" />;
  }

  return <>{children}</>;
};

export default AuthGate;
