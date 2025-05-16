import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, ImageStyle } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors, layout, spacing, typography } from '../theme';
import { StorageService } from '../services/storage';
import { MaterialIcons } from '@expo/vector-icons';


const BANNER_URL = 'https://mottu.com.br/wp-content/uploads/2023/09/Imagem-1-PC.webp';
type Props = NativeStackScreenProps<HomeStackParamList, 'HomeScreen'>;

export const Home = ({ navigation }: Props) => {
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Image source={{ uri: BANNER_URL }} style={bannerStyle} resizeMode="cover" />
        <View style={styles.header}>
          <Text style={styles.title}>Mottu Challenge</Text>
          <Text style={styles.subtitle}>Gestão Inteligente de Pátio</Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Bem-vindo!</Text>
          <Text style={styles.cardText}>
            Gerencie suas motos e vagas do pátio de forma inteligente. Acompanhe o status do pátio em tempo real, cadastre novas motos e mantenha tudo sob controle com praticidade e segurança.
          </Text>
        </Card>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <MaterialIcons name="local-parking" size={32} color={colors.primary} style={styles.statIcon} />
            <Text style={styles.statNumber}>{totalVagas}</Text>
            <Text style={styles.statLabel}>Vagas Totais</Text>
          </Card>
          <Card style={styles.statCard}>
            <MaterialIcons name="two-wheeler" size={32} color={colors.primary} style={styles.statIcon} />
            <Text style={styles.statNumber}>{motosAtivas}</Text>
            <Text style={styles.statLabel}>Motos Ativas</Text>
          </Card>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Ver Mapa do Pátio"
            onPress={() => navigation.navigate('MapaPatio')}
            variant="primary"
          />
          <Button
            title="Ver Lista de Motos"
            onPress={() => navigation.getParent()?.navigate('Motos')}
            variant="secondary"
          />
        </View>

        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Dicas de Uso</Text>
          <Text style={styles.tipsText}>• Utilize o mapa para localizar rapidamente vagas e motos.
• Cadastre novas motos facilmente pelo menu.
• Mantenha as informações sempre atualizadas para melhor controle do pátio.</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const bannerStyle: ImageStyle = {
  width: '100%',
  height: 160,
  borderRadius: spacing.md,
  marginBottom: spacing.md,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
    opacity: 0.7,
  },
  card: {
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
    padding: spacing.sm,
  },
  statIcon: {
    marginBottom: spacing.xs,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: 'normal',
    color: colors.text.secondary,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  tipsCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.card,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  tipsText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: colors.text.secondary,
  },
}); 