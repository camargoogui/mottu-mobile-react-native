/**
 * Serviço de notificações push
 * Fachada principal para gerenciar notificações no app
 */

import { useEffect, useRef } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { Notification } from 'expo-notifications';
import { 
  NotificationServiceConfig, 
  NotificationHandlers,
  PushNotificationPayload,
  NotificationPermissionStatus,
} from './types';
import { expoNotificationsClient } from './expoNotifications.client';

/**
 * Interface principal do serviço de notificações
 */
class NotificationService {
  private config: NotificationServiceConfig;
  private subscriptions: any[] = [];
  private handlers: NotificationHandlers = {};

  constructor(config: NotificationServiceConfig = {}) {
    this.config = {
      requestPermissionsOnInit: false,
      showNotificationsInForeground: true,
      handlers: {},
      ...config,
    };
    this.handlers = this.config.handlers || {};

    // Configura listeners por padrão
    this.setupListeners();
  }

  /**
   * Configura listeners para diferentes eventos de notificação
   */
  private setupListeners() {
    // Listener para notificações recebidas em foreground
    const receivedSubscription = expoNotificationsClient.addNotificationReceivedListener(
      (notification) => {
        console.log('📨 Notificação recebida:', notification);
        
        // Mostra alerta customizado em foreground
        if (this.config.showNotificationsInForeground) {
          this.handleForegroundNotification(notification);
        }

        // Chama handler customizado
        if (this.handlers.onNotificationReceived) {
          this.handlers.onNotificationReceived(notification);
        }
      }
    );

    // Listener para quando o usuário toca na notificação
    const responseSubscription = expoNotificationsClient.addNotificationResponseReceivedListener(
      (response) => {
        console.log('👆 Notificação tocada:', response);
        
        // Processa deep link/navegação
        this.handleNotificationTapped(response.notification);

        // Chama handler customizado
        if (this.handlers.onNotificationTapped) {
          this.handlers.onNotificationTapped(response.notification);
        }
      }
    );

    // Armazena subscriptions para cleanup
    this.subscriptions.push(receivedSubscription, responseSubscription);
  }

  /**
   * Handle para notificações em foreground
   */
  private async handleForegroundNotification(notification: Notification) {
    const { title, body, data } = notification.request.content;

    Alert.alert(
      title || 'Notificação',
      body || '',
      [
        {
          text: 'Ver',
          onPress: () => {
            if (data?.screen) {
              this.navigateToScreen(data.screen, data.params);
            }
          },
        },
        { text: 'OK', style: 'cancel' },
      ]
    );
  }

  /**
   * Handle para notificação tocada
   */
  private async handleNotificationTapped(notification: Notification) {
    const { data } = notification.request.content;

    // Navega para a tela especificada nos dados
    if (data?.screen) {
      this.navigateToScreen(data.screen, data.params);
    }
  }

  /**
   * Navega para uma tela específica baseada nos dados da notificação
   * TODO: Integrar com React Navigation quando o sistema estiver pronto
   */
  private navigateToScreen(screen: string, params?: any) {
    console.log('🧭 Navegando para:', screen, params);
    
    // Esta lógica será implementada com o sistema de navegação
    // Por enquanto, apenas loga
  }

  /**
   * Solicita permissões de notificação
   */
  async requestPermissions(): Promise<NotificationPermissionStatus> {
    const status = await expoNotificationsClient.getPermissionStatus();

    if (status === 'granted') {
      console.log('✅ Permissões de notificação já concedidas');
      return 'granted';
    }

    // Em iOS, precisa solicitar explicitamente
    if (Platform.OS === 'ios' || status === 'undetermined') {
      const result = await expoNotificationsClient.requestPermissions();
      return result.status;
    }

    // Em Android, se foi negado, pode abrir configurações
    if (status === 'denied') {
      Alert.alert(
        'Permissão Negada',
        'As notificações estão desabilitadas. Deseja abrir as configurações?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Abrir Configurações', 
            onPress: () => {
              if (Platform.OS === 'android') {
                Linking.openURL('app-settings:');
              }
            }
          },
        ]
      );
    }

    return status;
  }

  /**
   * Obtém o token de push do dispositivo
   */
  async getPushToken() {
    return await expoNotificationsClient.getPushToken();
  }

  /**
   * Obtém status das permissões
   */
  async getPermissionStatus(): Promise<NotificationPermissionStatus> {
    return await expoNotificationsClient.getPermissionStatus();
  }

  /**
   * Simula uma notificação local (para testes)
   */
  async sendTestNotification(
    title: string = 'Teste',
    body: string = 'Esta é uma notificação de teste',
    data?: Record<string, any>,
    seconds: number = 1
  ) {
    return await expoNotificationsClient.scheduleLocalNotification(
      title,
      body,
      data,
      seconds
    );
  }

  /**
   * Obtém informações sobre o dispositivo
   */
  async getDeviceInfo() {
    return await expoNotificationsClient.getDeviceInfo();
  }

  /**
   * Configura handlers customizados
   */
  setHandlers(handlers: NotificationHandlers) {
    this.handlers = { ...this.handlers, ...handlers };
  }

  /**
   * Limpa todos os listeners
   */
  cleanup() {
    this.subscriptions.forEach((subscription) => {
      expoNotificationsClient.removeNotificationSubscription(subscription);
    });
    this.subscriptions = [];
  }
}

/**
 * Instância singleton do serviço
 */
let notificationServiceInstance: NotificationService | null = null;

/**
 * Factory para criar instância do serviço
 */
export const createNotificationService = (
  config: NotificationServiceConfig = {}
): NotificationService => {
  if (!notificationServiceInstance) {
    notificationServiceInstance = new NotificationService(config);
  }
  return notificationServiceInstance;
};

/**
 * Hook para usar o serviço de notificações em componentes React
 */
export const useNotificationService = (config: NotificationServiceConfig = {}) => {
  const serviceRef = useRef<NotificationService | null>(null);

  useEffect(() => {
    // Cria instância do serviço
    serviceRef.current = createNotificationService(config);

    // Cleanup na desmontagem
    return () => {
      if (serviceRef.current) {
        serviceRef.current.cleanup();
        serviceRef.current = null;
      }
    };
  }, []);

  return serviceRef.current;
};

/**
 * Exporta instância padrão
 */
export const notificationService = createNotificationService({
  requestPermissionsOnInit: false,
  showNotificationsInForeground: true,
});

export default notificationService;

/**
 * Exemplo de payload para notificação
 */
export const createPushPayload = (
  title: string,
  body: string,
  data?: Record<string, any>
): PushNotificationPayload => ({
  title,
  body,
  data,
  sound: true,
  badge: 1,
});

