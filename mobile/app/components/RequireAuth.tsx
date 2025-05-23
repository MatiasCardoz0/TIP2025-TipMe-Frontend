import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router'; 

const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { authState } = useAuth();

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
