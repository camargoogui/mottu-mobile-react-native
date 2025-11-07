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
import { useLanguage } from '../contexts/LanguageContext';
import { notificationService } from '../services/notifications';
import { NotificationPermissionStatus } from '../services/notifications/types';

export const PushDebugScreen = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
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
        Alert.alert(t('pushDebug.permissionGrantedAlert'), t('pushDebug.permissionGrantedMessage'));
      } else if (status === 'denied') {
        Alert.alert(t('pushDebug.permissionDeniedAlert'), t('pushDebug.permissionDeniedMessage'));
      }
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      Alert.alert(t('common.error'), t('pushDebug.errorRequestPermissions'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetPushToken = async () => {
    Alert.alert(
      t('pushDebug.pushTokensDisabled'),
      t('pushDebug.pushTokensDisabledMessage'),
      [{ text: t('common.ok') }]
    );
  };

  const handleSendTestNotification = async () => {
    setIsLoading(true);
    try {
      const notificationId = await notificationService.sendTestNotification(
        t('pushDebug.testNotificationTitle'),
        t('pushDebug.testNotificationBody'),
        { 
          screen: 'Home', 
          testData: 'test123',
          timestamp: new Date().toISOString(),
        },
        1
      );

      if (notificationId) {
        setLastNotification(notificationId);
        Alert.alert(t('pushDebug.testSent'), t('pushDebug.testSentMessage'));
      }
    } catch (error) {
      console.error('Erro ao enviar teste:', error);
      Alert.alert(t('common.error'), t('pushDebug.errorSendTest'));
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
        t('pushDebug.deviceInfo'),
        `${t('pushDebug.deviceInfoStatus')}: ${info?.status}\n${t('pushDebug.deviceInfoPlatform')}: ${info?.platform}\n${t('pushDebug.deviceInfoIsDevice')}: ${info?.isDevice ? t('pushDebug.deviceInfoIsDeviceNo') : t('pushDebug.deviceInfoIsDeviceYes')}`,
        [{ text: t('common.ok') }]
      );
    } catch (error) {
      console.error('Erro ao obter informações:', error);
      Alert.alert(t('common.error'), t('pushDebug.errorGetDeviceInfo'));
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
        return t('pushDebug.permissionGranted');
      case 'denied':
        return t('pushDebug.permissionDenied');
      default:
        return t('pushDebug.permissionPending');
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
        🔔 {t('pushDebug.title')}
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.secondaryLabel }]}>
        {t('pushDebug.subtitle')}
      </Text>

      {/* Status Card */}
      <View style={[styles.statusCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.statusTitle, { color: theme.colors.label }]}>{t('pushDebug.permissionStatus')}</Text>
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
            {t('pushDebug.pushToken')}:
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
        t('pushDebug.requestPermissions'),
        t('pushDebug.requestPermissionsSubtitle')
      )}

      {renderButton(
        handleGetPushToken,
        'smartphone',
        t('pushDebug.getPushToken'),
        t('pushDebug.getPushTokenSubtitle')
      )}

      {renderButton(
        handleSendTestNotification,
        'send',
        t('pushDebug.sendTestNotification'),
        t('pushDebug.sendTestNotificationSubtitle')
      )}

      {renderButton(
        handleGetDeviceInfo,
        'info',
        t('pushDebug.getDeviceInfo'),
        t('pushDebug.getDeviceInfoSubtitle')
      )}

      {/* Last Notification ID */}
      {lastNotification && (
        <View style={[styles.infoCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.infoLabel, { color: theme.colors.secondaryLabel }]}>
            {t('pushDebug.lastNotification')}:
          </Text>
          <Text style={[styles.infoValue, { color: theme.colors.label }]}>
            {lastNotification}
          </Text>
        </View>
      )}

      {/* Instructions */}
      <View style={[styles.instructionsCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.instructionsTitle, { color: theme.colors.label }]}>
          {t('pushDebug.instructions')}
        </Text>
        <Text style={[styles.instructionsText, { color: theme.colors.secondaryLabel }]}>
          {t('pushDebug.instruction1')}{'\n'}
          {t('pushDebug.instruction2')}{'\n'}
          {t('pushDebug.instruction3')}{'\n'}
          {t('pushDebug.instruction4')}
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

