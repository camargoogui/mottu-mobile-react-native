import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, ImageStyle } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { StorageService } from '../services/storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';


const BANNER_URL = 'https://mottu.com.br/wp-content/uploads/2023/09/Imagem-1-PC.webp';
type Props = NativeStackScreenProps<HomeStackParamList, 'HomeScreen'>;

export const Home = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [totalVagas, setTotalVagas] = useState(0);
  const [motosAtivas, setMotosAtivas] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      const vagas = await StorageService.getVagas();
      const motos = await StorageService.getMotos();
      setTotalVagas(vagas.length);
      setMotosAtivas(motos.filter(m => m.status === 'ocupada').length);
    }
    fetchStats();
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Image source={{ uri: BANNER_URL }} style={bannerStyle} resizeMode="cover" />
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.label }]}>{t('auth.appTitle')}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.secondaryLabel }]}>{t('auth.appSubtitle')}</Text>
        </View>

        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.label }]}>{t('home.welcome')}!</Text>
          <Text style={[styles.cardText, { color: theme.colors.secondaryLabel }]}>
            {t('home.welcomeMessage')}
          </Text>
        </Card>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <MaterialIcons name="local-parking" size={32} color={theme.colors.primary} style={styles.statIcon} />
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{totalVagas}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>{t('home.totalParkingSpots')}</Text>
          </Card>
          <Card style={styles.statCard}>
            <MaterialIcons name="two-wheeler" size={32} color={theme.colors.primary} style={styles.statIcon} />
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{motosAtivas}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>{t('home.activeMotorcycles')}</Text>
          </Card>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={t('home.viewMap')}
            onPress={() => navigation.navigate('MapaPatio')}
            variant="primary"
          />
          <View style={styles.buttonRow}>
            <Button
              title={t('home.listMotorcycles')}
              onPress={() => navigation.getParent()?.navigate('Motos')}
              variant="secondary"
              style={styles.halfButton}
            />
            <Button
              title={t('home.manageBranches')}
              onPress={() => navigation.getParent()?.navigate('Filiais')}
              variant="tertiary"
              style={styles.halfButton}
            />
          </View>
        </View>

        <Card style={styles.tipsCard}>
          <Text style={[styles.tipsTitle, { color: theme.colors.primary }]}>{t('home.usageTips')}</Text>
          <Text style={[styles.tipsText, { color: theme.colors.text.secondary }]}>
            {t('home.tip1')}{'\n'}{t('home.tip2')}{'\n'}{t('home.tip3')}
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const bannerStyle: ImageStyle = {
  width: '100%',
  height: 160,
  borderRadius: 16,
  marginBottom: 16,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 34,
    letterSpacing: 0.36,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.41,
    opacity: 0.7,
  },
  card: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '400',
    lineHeight: 28,
    letterSpacing: 0.35,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    padding: 8,
  },
  statIcon: {
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
  buttonContainer: {
    gap: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfButton: {
    flex: 1,
  },
  tipsCard: {
    marginTop: 24,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 16,
    fontWeight: '400',
  },
}); 