import { Stack, useRouter } from "expo-router";
import Navbar from "./components/NavBar";
import { AuthProvider } from "./context/AuthContext";
import AuthGate from "./components/RequireAuth";

export default function RootLayout() {
    //uso stack para navegar múltiples páginas. 
    // Expo router maneja la navegación entre pantallas, evita tener que usar react navigation y poner manualmente las rutas (<Stack.Screen name="homeScreen" component={HomeScreen} />, .etc)
  return (
    <AuthProvider>
      <AuthGate>
        <Navbar />
        <Stack screenOptions={{ headerShown: false }} />
      </AuthGate>
    </AuthProvider>
  );
}