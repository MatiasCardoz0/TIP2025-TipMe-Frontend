import { Slot, useRouter, usePathname } from "expo-router";
import React, { useEffect } from "react";
import { useAuth, AuthProvider } from "../src/context/AuthContext";
import Navbar from "./components/NavBar";

export default function MainLayout() {
  console.log("MainLayout mounted")
  const { authState } = useAuth();
  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => {
      console.log("authState in useEffect:", authState, "pathname:", pathname);

  if (authState?.authenticated === true) {
    router.replace("/home");
  } else if (authState?.authenticated === false) {
    router.replace("/login");
  }
  }, [authState, pathname]);

  //uso stack para navegar múltiples páginas. 
  // Expo router maneja la navegación entre pantallas, evita tener que usar react navigation y poner manualmente las rutas (<Stack.Screen name="homeScreen" component={HomeScreen} />, .etc)
  return (
    <>
        <Navbar />
        <Slot />
    </>
  );
}