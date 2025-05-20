import { Stack } from "expo-router";
import Navbar from "./components/NavBar";
import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginScreen from "./pages/login";

export default function RootLayout() {

    const {authState, onLogout} = useAuth();

    //uso stack para navegar múltiples páginas. 
    // Expo router maneja la navegación entre pantallas, evita tener que usar react navigation y poner manualmente las rutas (<Stack.Screen name="homeScreen" component={HomeScreen} />, .etc)
  return (
  <AuthProvider>
    {authState?.authenticated ? (
        <>
        <Navbar/>
        <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      </>)
      : <LoginScreen />}
  </AuthProvider>
 );
};