import React, { useEffect, useState } from "react";
import { NotificationProvider } from "./notificationContext";
import HomeScreen from "./pages/homeScreen";
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { config } from './config';

export default function App() {

    const [notification, setNotification] = useState<string | null>(null);
    
    useEffect(() => { // se ejecuta una vez al cargar el componente
      registerForPushNotificationsAsync();
    });
    
    useEffect(() => {//se ejecuta cuando hay cambio de estado en la notificación
      if (notification) {
        console.log("Notificación recibida:", notification);
        showNotification(notification); 
      }
        
      }, [notification]
    );
  
    const showNotification = (message: string) => {
      new Notification("TipMe", {
        body: message,
        icon: "/path/to/icon.png", // Opcional
      });
    };
        
    // Configuración de notificaciones
    const registerForPushNotificationsAsync = async () => {
      
          if (Constants.isDevice) {
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log('Push token:', token);
            
            // envia el token al servidor para que lo almacene y lo use para enviar notificaciones
            await axios.post(`${config.API_URL}/api/waiter/register-push-token`, { ExpoToken: token, IdMozo: 1 }); 
            
          } else {
            // manejo del caso en que se está ejecutando en un browser
            if ("Notification" in window) {//verifica si el navegador soporta notificaciones
              if (Notification.permission === "default") {
                Notification.requestPermission().then((permission) => {
                  if (permission === "granted") {
                    console.log("Permiso para notificaciones concedido.");
                    connectToWebSocket();
                  } else {
                    console.error("Permiso para notificaciones denegado.");
                  }
                });
              } else if (Notification.permission === "granted") {
                console.log("Permiso ya concedido.");
                connectToWebSocket();
        } else {
          console.error("Permiso para notificaciones denegado.");
        }
      } else {
        console.error("Este navegador no soporta notificaciones.");
        }
      }
    }

    const connectToWebSocket = () => {
      //conectar al websocket server
      const socket = new WebSocket(`${config.API_URL}/api/connect?userId=${1}&esMozo=${true}`);
            
      // Escuchar el evento de notificación
      socket.onmessage = (event) => {
        console.log("Mensaje recibido:", event.data);
        setNotification(event.data); // Actualizar la notificación
      };
      
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      
      return () => {
        socket.close(); //cuando se desmonta el componente se cierra la conexión
      };
    }
      
  return (
      <HomeScreen />
  );
}