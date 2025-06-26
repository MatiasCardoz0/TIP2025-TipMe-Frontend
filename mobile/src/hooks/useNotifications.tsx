import { useEffect, useState } from "react";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import axios from "axios";
import { config } from "../../config";

export const useNotifications = (userId: number) => {
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {// se ejecuta una vez al cargar el componente
    registerForNotifications();
  }, []);

  useEffect(() => {// se ejecuta cuando hay cambio de estado en la notificación
    if (notification) {
      showBrowserNotification(notification);
    }
  }, [notification]);

  
  const showBrowserNotification = (message: string) => {
    new Notification("TipMe", {
      body: message,
    });
  };


  // Configuración de notificaciones
  const registerForNotifications = async () => {
        if (Constants.isDevice) {
        getDeviceNotificationsPermission();
        try {
            const { data: expoToken } = await Notifications.getExpoPushTokenAsync();
            console.log("Push token:", expoToken);

            await axios.post(`${config.API_URL}/api/waiter/register-push-token`, {
            ExpoToken: expoToken,
            IdMozo: userId, 
            });
        } catch (error) {
            console.error("Error al registrar el push token:", error);
          }
        } else if ("Notification" in window) {// manejo del caso en que se está ejecutando en un browser
        if (Notification.permission === "default") {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
            connectToWebSocket();
            } else {
            console.warn("Permiso para notificaciones denegado");
            }
        } else if (Notification.permission === "granted") {
            connectToWebSocket();
        } else {
            console.warn("Permiso para notificaciones denegado");
        }
        } else {
        console.warn("Este navegador no soporta notificaciones");
        }
  };

  const getDeviceNotificationsPermission = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync(); 
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          console.warn("Permiso de notificaciones denegado");
          return;
        }
        finalStatus = status;
      } else {
        console.log("Permiso de notificaciones ya concedido");
      }
  }

  const connectToWebSocket = () => {
    userId = localStorage.getItem("userId") ? parseInt(localStorage.getItem("userId") || "0") : 0;
    const socket = new WebSocket(
      `${config.API_URL}/api/connect?userId=${userId}&esMozo=${true}`
    );

    socket.onmessage = (event) => {
      console.log("Mensaje recibido:", event.data);
      const msg = event.data;
      setNotification(msg);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  };

};