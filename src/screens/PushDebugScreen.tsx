import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { notificationService } from '../services/notifications';
import { NotificationPermissionStatus } from '../services/notifications/types';

export const PushDebugScreen = () => {
  const { theme } = useTheme();
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus>('undetermined');
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      const status = await notificationService.getPermissionStatus();
      setPermissionStatus(status);
    } catch (error) {
      console.error('Erro ao verificar status de permissões:', error);
    }
  };

  const handleRequestPermissions = async () => {
    setIsLoading(true);
    try {
      const status = await notificationService.requestPermissions();
      setPermissionStatus(status);

      if (status === 'granted') {
        Alert.alert('✅ Permissão Concedida', 'Notificações push ativadas!');
      } else if (status === 'denied') {
        Alert.alert('❌ Permissão Negada', 'Notificações push foram negadas.');
      }
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      Alert.alert('Erro', 'Não foi possível solicitar permissões');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetPushToken = async () => {
    setIsLoading(true);
    try {
      const token = await notificationService.getPushToken();
      
      if (token) {
        setPushToken(token.data);
        
        // Mostra alerta com opção de copiar
        Alert.alert(
          '📱 Token de Push',
          token.data.substring(0, 50) + '...',
          [
            { text: 'OK' },
            { 
              text: 'Copiar Token', 
              onPress: () => {
                console.log('Token completo:', token.data);
              }
            },
          ]
        );
      } else {
        Alert.alert('Erro', 'Não foi possível obter o token');
      }
    } catch (error) {
      console.error('Erro ao obter token:', error);
      Alert.alert('Erro', 'Erro ao obter token de push');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTestNotification = async () => {
    setIsLoading(true);
    try {
      const notificationId = await notificationService.sendTestNotification(
        '🧪 Notificação de Teste',
        'Esta é uma notificação de teste enviada localmente.',
        { 
          screen: 'Home', 
          testData: 'test123',
          timestamp: new Date().toISOString(),
        },
        1
      );

      if (notificationId) {
        setLastNotification(notificationId);
        Alert.alert('✅ Teste Enviado', 'Notificação será exibida em 1 segundo');
      }
    } catch (error) {
      console.error('Erro ao enviar teste:', error);
      Alert.alert('Erro', 'Erro ao enviar notificação de teste');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetDeviceInfo = async () => {
    setIsLoading(true);
    try {
      const info = await notificationService.getDeviceInfo();
      setDeviceInfo(info);
      
      Alert.alert(
        '📱 Informações do Dispositivo',
        `Status: ${info?.status}\nPlataforma: ${info?.platform}\nÉ Simulador: ${info?.isDevice ? 'Não' : 'Sim'}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erro ao obter informações:', error);
      Alert.alert('Erro', 'Erro ao obter informações do dispositivo');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (permissionStatus) {
      case 'granted':
        return '#4CAF50';
      case 'denied':
        return '#F44336';
      default:
        return '#FF9800';
    }
  };

  const getStatusText = () => {
    switch (permissionStatus) {
      case 'granted':
        return '✅ Concedida';
      case 'denied':
        return '❌ Negada';
      default:
        return '⏳ Pendente';
    }
  };

  const renderButton = (
    onPress: () => void,
    icon: string,
    title: string,
    subtitle?: string
  ) => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      onPress={onPress}
      disabled={isLoading}
    >
      <View style={styles.buttonContent}>
        <MaterialIcons name={icon as any} size={28} color={theme.colors.primary} />
        <View style={styles.buttonText}>
          <Text style={[styles.buttonTitle, { color: theme.colors.label }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.buttonSubtitle, { color: theme.colors.secondaryLabel }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {isLoading && (
        <ActivityIndicator size="small" color={theme.colors.primary} style={styles.loading} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: theme.colors.label }]}>
        🔔 Push Notifications Debug
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.secondaryLabel }]}>
        Teste e configure notificações push
      </Text>

      {/* Status Card */}
      <View style={[styles.statusCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.statusTitle, { color: theme.colors.label }]}>Status da Permissão</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={[styles.statusText, { color: theme.colors.label }]}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      {/* Token Display */}
      {pushToken && (
        <View style={[styles.tokenCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.tokenLabel, { color: theme.colors.secondaryLabel }]}>
            Token de Push:
          </Text>
          <Text style={[styles.tokenValue, { color: theme.colors.label }]} numberOfLines={2}>
            {pushToken}
          </Text>
        </View>
      )}

      {/* Buttons */}
      {renderButton(
        handleRequestPermissions,
        'notifications',
        'Solicitar Permissões',
        'Pedir acesso para enviar notificações'
      )}

      {renderButton(
        handleGetPushToken,
        'smartphone',
        'Obter Token de Push',
        'Buscar token do dispositivo'
      )}

      {renderButton(
        handleSendTestNotification,
        'send',
        'Enviar Notificação de Teste',
        'Simular notificação local'
      )}

      {renderButton(
        handleGetDeviceInfo,
        'info',
        'Informações do Dispositivo',
        'Ver detalhes do dispositivo'
      )}

      {/* Last Notification ID */}
      {lastNotification && (
        <View style={[styles.infoCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.infoLabel, { color: theme.colors.secondaryLabel }]}>
            Última Notificação:
          </Text>
          <Text style={[styles.infoValue, { color: theme.colors.label }]}>
            {lastNotification}
          </Text>
        </View>
      )}

      {/* Instructions */}
      <View style={[styles.instructionsCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.instructionsTitle, { color: theme.colors.label }]}>
          📋 Instruções
        </Text>
        <Text style={[styles.instructionsText, { color: theme.colors.secondaryLabel }]}>
          1. Solicite permissões primeiro{'\n'}
          2. Obtenha o token de push{'\n'}
          3. Use o token para enviar notificações do backend{'\n'}
          4. Teste com notificação local
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  statusCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tokenCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  tokenLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  tokenValue: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  button: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    flex: 1,
    marginLeft: 12,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
  },
  loading: {
    marginLeft: 8,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  instructionsCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 24,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

