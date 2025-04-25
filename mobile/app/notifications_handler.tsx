import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useEffect } from 'react';
import { config } from './config';
import axios from 'axios';

const registerForPushNotificationsAsync = async () => {
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push token:', token);

    // envia el token al servidor para que lo almacene y lo use para enviar notificaciones
    await axios.post(`${config.API_URL}/api/waiter/register-push-token`, { ExpoToken: token, IdMozo: 1 }); 

  } else {
    alert('SE tiene que usar un dispositivo físico para las notificationes Push ');
  }
};

export default function NotificationsHandler() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return null;
}