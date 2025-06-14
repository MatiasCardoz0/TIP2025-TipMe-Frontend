import {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface AuthProps {
    authState ? : { token: string | null; authenticated: boolean | null };
    onRegister ? : (email: string, password: string) => Promise<any>;
    onLogin ? : (email: string, password: string) => Promise<any>;
    onLogout ? : () => Promise<any>;
    loading ? : boolean;
}

const TOKEN_KEY = 'my-jwt';
const API_URL = 'http://192.168.0.102:5065/api/auth';
const AuthContext = createContext<AuthProps>({});

  export const useAuth = () => {
   const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth se debe usar dentro del AuthProvider. chequear que AuthProvider esté envolviendo los componentes que lo usan");
    }
    return context;
  }

  export const AuthProvider = ({ children }: any) => {

    const [authState, setAuthState] = useState<{ token: string | null; authenticated: boolean | null }>({
      token: null,
      authenticated: false,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkToken = async () => {
        let token : string | null = null;
        
        try { //chequear si el token existe
                if (Platform.OS === "web") { // Si estamos en la web usamos localStorage
                    token = await localStorage.getItem(TOKEN_KEY);
                } else { // Si estamos en mobile usamos SecureStore
                    token = await SecureStore.getItemAsync(TOKEN_KEY);
                }
                console.log('token del storage:', token);
            } catch (error) {
                console.warn("Error getting token from storage:", error);
            }
        if (token) {// Si el token existe, se guarda  y adjunta en headers para usar en todas las requests
          setAuthState({ token, authenticated: true });
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          setAuthState({ token: null, authenticated: false });
        }
        setLoading(false); // Termina el loading una vez que se chequea el token
      };
      checkToken();
    }, []);

    const register = async (email: string, password: string) => {
      try {
        const response = await axios.post(`${API_URL}/register`, { email, password });
        return response.data;
      } catch (error: any) {
        console.error('Registration error:', error);
        return {error: true, message: 'Registration failed: ' + error?.response?.data?.message};
      }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { token } = response.data;
            setAuthState({ token, authenticated: true });

            //adjuntar header a todas las request futuras para mostrar que el usuario está autenticado
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

                if (Platform.OS === "web") {// en la web usamos localStorage
                  localStorage.setItem(TOKEN_KEY, token);
                } else { 
                  //en mobile guardar el token en el secure storage de expo
                  await SecureStore.setItemAsync(TOKEN_KEY, token);
                }
            return response.data;
        
        } catch (error: any) {
            console.error('Login error:', error);
            return {error: true, message: 'Login failed: ' + error.response?.data?.message};
        }
    }
    const logout = async () => {
        try {
            //elimino el token del storage
             if (Platform.OS === "web") {
                localStorage.removeItem(TOKEN_KEY);
            } else {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            }
            //actualizo los headers
            axios.defaults.headers.common['Authorization'] = null;

            //reseteo el estado de autenticación
            setAuthState({ token: null, authenticated: false });
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

        const value = {
            onRegister: register,
            onLogin: login,
            onLogout: logout,
            authState,
            loading
        };
      
        return (
        <AuthContext.Provider value={value}> 
          {children}
        </AuthContext.Provider>
        );
}
