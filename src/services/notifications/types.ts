/**
 * Tipos relacionados ao serviço de notificações push
 */

import { Notification } from 'expo-notifications';

/**
 * Status das permissões de notificação
 */
export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined';

/**
 * Token de dispositivo para push notifications
 */
export interface PushToken {
  data: string;
  type: 'expo' | 'fcm';
}

/**
 * Payload de uma notificação push
 */
export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: boolean;
  badge?: number;
}

/**
 * Handlers para diferentes estados da notificação
 */
export interface NotificationHandlers {
  onNotificationReceived?: (notification: Notification) => void;
  onNotificationTapped?: (notification: Notification) => void;
  onError?: (error: Error) => void;
}

/**
 * Configurações do serviço de notificações
 */
export interface NotificationServiceConfig {
  requestPermissionsOnInit?: boolean;
  showNotificationsInForeground?: boolean;
  handlers?: NotificationHandlers;
}

/**
 * Resposta ao solicitar permissões
 */
export interface PermissionResult {
  status: NotificationPermissionStatus;
  canAskAgain?: boolean;
}

