import { Slot, Stack, useRootNavigationState, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import AuthGate from "./components/RequireAuth";
import { usePathname } from "expo-router";

export default function MainLayout() {

    const pathname  = usePathname();
      const { authState } = useAuth();
        const rootNavigationState = useRootNavigationState();
  const router = useRouter();



  useEffect(() => {
  if (authState?.authenticated === true) {
    router.replace("/home");
  } else if (authState?.authenticated === false) {
    router.replace("/login");
  }
  }, [authState]);



  //uso stack para navegar múltiples páginas. 
  // Expo router maneja la navegación entre pantallas, evita tener que usar react navigation y poner manualmente las rutas (<Stack.Screen name="homeScreen" component={HomeScreen} />, .etc)
  return (
      <AuthGate>
        <Slot />
      </AuthGate>
  );
}