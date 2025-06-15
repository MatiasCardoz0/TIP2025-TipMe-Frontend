import { AuthProvider } from "../src/context/AuthContext";
import { useNotifications } from "@/src/hooks/useNotifications";
import MainLayout from "./MainLayout";
import { useStorage } from "../src/hooks/useStorage"

export default function RootLayout() {
  const {getDataLocal} = useStorage();

  //useNotifications(parseInt(localStorage.getItem("userId") || "0" ));

  useNotifications(parseInt(getDataLocal("userId") || "0" ));

  //uso stack para navegar múltiples páginas. 
  // Expo router maneja la navegación entre pantallas, evita tener que usar react navigation y poner manualmente las rutas (<Stack.Screen name="homeScreen" component={HomeScreen} />, .etc)

  return (
    <AuthProvider>
      <MainLayout/>
    </AuthProvider>
  );
}
