/**
 * Cliente de notificações usando Expo Notifications
 * Responsável pela comunicação com o sistema de notificações nativo
 * 
 * NOTA: Desabilitado para evitar conflito com Firebase existente no projeto
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { 
  NotificationPermissionStatus, 
  PushToken, 
  PermissionResult 
} from './types';

/**
 * Configura o comportamento padrão das notificações
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Classe cliente para expo-notifications
 */
export class ExpoNotificationsClient {
  /**
   * Solicita permissões de notificação
   */
  async requestPermissions(): Promise<PermissionResult> {
    try {
      const { status, canAskAgain } = await Notifications.requestPermissionsAsync();
      
      return {
        status: status === 'granted' ? 'granted' : 
                status === 'denied' ? 'denied' : 'undetermined',
        canAskAgain,
      };
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      return {
        status: 'denied',
        canAskAgain: false,
      };
    }
  }

  /**
   * Obtém o status atual das permissões
   */
  async getPermissionStatus(): Promise<NotificationPermissionStatus> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      
      if (status === 'granted') return 'granted';
      if (status === 'denied') return 'denied';
      return 'undetermined';
    } catch (error) {
      console.error('Erro ao obter status de permissões:', error);
      return 'undetermined';
    }
  }

  /**
   * Obtém o token de push do dispositivo
   * DESABILITADO: Não podemos usar FCM e não temos projectId configurado
   */
  async getPushToken(): Promise<PushToken | null> {
    console.log('📴 Push tokens remotos desabilitados para evitar conflito com Firebase');
    console.log('💡 Apenas notificações locais estão disponíveis');
    return null;
  }

  /**
   * Registra listener para notificações recebidas (foreground)
   */
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  /**
   * Registra listener para quando o usuário toca na notificação
   */
  addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  /**
   * Remove um listener
   */
  removeNotificationSubscription(subscription: Notifications.Subscription) {
    if (subscription) {
      if ('remove' in subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    }
  }

  /**
   * Agenda uma notificação local (para testes)
   */
  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: Record<string, any>,
    seconds: number = 1
  ): Promise<string | null> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: { seconds } as any,
      });

      return notificationId;
    } catch (error) {
      console.error('Erro ao agendar notificação local:', error);
      return null;
    }
  }

  /**
   * Cancela todas as notificações agendadas
   */
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Cancela uma notificação específica
   */
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  /**
   * Obtém informações sobre o dispositivo
   */
  async getDeviceInfo() {
    try {
      const token = await this.getPushToken();
      const status = await this.getPermissionStatus();
      
      return {
        token,
        status,
        platform: Platform.OS,
        info: 'Push notifications locais disponíveis',
      };
    } catch (error) {
      console.error('Erro ao obter informações do dispositivo:', error);
      return null;
    }
  }
}

/**
 * Instância singleton do cliente
 */
export const expoNotificationsClient = new ExpoNotificationsClient();

