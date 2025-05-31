import { AuthProvider } from "../src/context/AuthContext";
import { useNotifications } from "@/src/hooks/useNotifications";
import MainLayout from "./MainLayout";

export default function RootLayout() {

  useNotifications(1);

  //uso stack para navegar múltiples páginas. 
  // Expo router maneja la navegación entre pantallas, evita tener que usar react navigation y poner manualmente las rutas (<Stack.Screen name="homeScreen" component={HomeScreen} />, .etc)

  return (
    <AuthProvider>
      <MainLayout/>
    </AuthProvider>
  );
}
