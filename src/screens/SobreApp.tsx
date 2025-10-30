import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { MaterialIcons } from '@expo/vector-icons';
import { getBuildInfo } from '../config/buildInfo';
// @ts-ignore - app.json não tem tipos TypeScript
import appJson from '../../app.json';

export const SobreApp = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [buildInfo, setBuildInfo] = React.useState(() => getBuildInfo());

  // Atualiza as informações de build quando o componente monta
  React.useEffect(() => {
    const info = getBuildInfo();
    setBuildInfo(info);
    
    // Log para debug
    console.log('Build Info:', info);
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('aboutApp.notAvailable');
    try {
      // Tenta parsear diferentes formatos de data
      let date: Date;
      
      // Se já estiver em formato ISO
      if (dateString.includes('T') || dateString.includes('Z')) {
        date = new Date(dateString);
      } else {
        // Formato Git: "2025-10-29 13:39:22 -0300"
        // Remove o timezone e ajusta manualmente
        const cleaned = dateString.replace(/ (-|\+)\d{4}$/, '');
        date = new Date(cleaned);
      }
      
      // Verifica se a data é válida
      if (isNaN(date.getTime())) {
        return dateString; // Retorna original se não conseguir parsear
      }
      
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const infoItems = [
    {
      icon: 'info',
      label: t('aboutApp.appName'),
      value: appJson.expo.name,
    },
    {
      icon: 'tag',
      label: t('aboutApp.version'),
      value: buildInfo.version,
    },
    {
      icon: 'code',
      label: t('aboutApp.commitHash'),
      value: buildInfo.commitHash,
      isCopyable: true,
    },
    {
      icon: 'source',
      label: t('aboutApp.branch'),
      value: buildInfo.branchName || t('aboutApp.notAvailable'),
    },
    {
      icon: 'build',
      label: t('aboutApp.buildType'),
      value: t(`aboutApp.buildType.${buildInfo.buildType || 'development'}`),
    },
    {
      icon: 'calendar-today',
      label: t('aboutApp.buildDate'),
      value: formatDate(buildInfo.buildDate),
    },
    {
      icon: 'commit',
      label: t('aboutApp.commitDate'),
      value: formatDate(buildInfo.commitDate),
    },
    {
      icon: 'phone-android',
      label: t('aboutApp.platform'),
      value: buildInfo.platform.toUpperCase(),
    },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <MaterialIcons 
          name="info-outline" 
          size={48} 
          color={theme.colors.primary} 
        />
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          {t('aboutApp.title')}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          {t('aboutApp.subtitle')}
        </Text>
      </View>

      <View style={[styles.infoSection, { backgroundColor: theme.colors.card }]}>
        {infoItems.map((item, index) => (
          <View 
            key={index} 
            style={[
              styles.infoItem,
              index !== infoItems.length - 1 && { 
                borderBottomWidth: 1, 
                borderBottomColor: theme.colors.border 
              }
            ]}
          >
            <View style={styles.infoItemLeft}>
              <MaterialIcons 
                name={item.icon as any} 
                size={24} 
                color={theme.colors.primary} 
                style={styles.icon}
              />
              <Text style={[styles.infoLabel, { color: theme.colors.text.primary }]}>
                {item.label}
              </Text>
            </View>
            <View style={styles.infoItemRight}>
              <Text 
                style={[
                  styles.infoValue, 
                  { color: theme.colors.text.secondary },
                  item.isCopyable && styles.infoValueHash
                ]}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {item.value}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.footerSection, { backgroundColor: theme.colors.card }]}>
        <MaterialIcons 
          name="description" 
          size={20} 
          color={theme.colors.primary} 
        />
        <Text style={[styles.footerText, { color: theme.colors.text.secondary }]}>
          {t('aboutApp.footer')}
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
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  infoSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    minHeight: 48,
  },
  infoItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  infoItemRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  icon: {
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'right',
    maxWidth: '100%',
  },
  infoValueHash: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  footerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  footerText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});

