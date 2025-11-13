import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import api from '@/services/api';
import { useRouter } from 'expo-router';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

export const usePushNotifications = (token: string | null, userType: 'INSTITUTION' | 'VOLUNTARY' | null): PushNotificationState => {
  const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken>();
  const [notification, setNotification] = useState<Notifications.Notification>();
  const router = useRouter();

  const notificationListener = useRef<Notifications.Subscription | undefined>(undefined);
  const responseListener = useRef<Notifications.Subscription | undefined>(undefined);

  
  async function registerPushToken(pushToken: string) {
    if (!token || !userType) return;
    
    try {
      const endpoint = userType === 'INSTITUTION' 
        ? '/institution/register-push-token'
        : '/voluntary/register-push-token';

      await api.post(endpoint, 
        { pushToken },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✅ Push token registrado no backend:', pushToken);
    } catch (error) {
      console.error('❌ Erro ao registrar push token:', error);
    }
  }

  
  async function registerForPushNotificationsAsync() {
    
    
    if (!Device.isDevice) {
      console.log('⚠️ Push notifications requerem dispositivo físico e Development Build');
      return;
    }

    let pushToken;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#173663',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('❌ Permissão de notificação negada');
        return;
      }

      try {
        pushToken = (
          await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas?.projectId,
          })
        ).data;
        console.log('📱 Expo Push Token:', pushToken);
      } catch (error) {
        console.error('❌ Erro ao obter push token:', error);
        return;
      }
    } else {
      console.log('⚠️ Push notifications só funcionam em dispositivos físicos');
    }

    return pushToken;
  }

  
  function handleNotificationNavigation(data: any) {
    if (!data || !data.cardId) return;

    const { cardId, type } = data;

    
    if (userType === 'VOLUNTARY') {
      
      router.push(`/(voluntary)/opportunity/${cardId}?from=notifications` as any);
    } else if (userType === 'INSTITUTION') {
      
      router.push(`/(institution)/opportunity/${cardId}` as any);
    }
  }

  useEffect(() => {
    
    if (!token || !userType) return;

    
    registerForPushNotificationsAsync().then((pushToken) => {
      if (pushToken) {
        setExpoPushToken({ data: pushToken, type: 'expo' } as Notifications.ExpoPushToken);
        registerPushToken(pushToken);
      }
    });

    
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('📩 Notificação recebida:', notification);
      setNotification(notification);
    });

    
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('👆 Notificação tocada:', response);
      const data = response.notification.request.content.data;
      
      
      handleNotificationNavigation(data);
    });

    
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [token, userType]);

  return {
    expoPushToken,
    notification,
  };
};
