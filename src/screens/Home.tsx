import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, ImageStyle } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { StorageService } from '../services/storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';


const BANNER_URL = 'https://mottu.com.br/wp-content/uploads/2023/09/Imagem-1-PC.webp';
type Props = NativeStackScreenProps<HomeStackParamList, 'HomeScreen'>;

export const Home = ({ navigation }: Props) => {
  const { theme } = useTheme();
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
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Mottu Challenge</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>Gestão Inteligente de Pátio</Text>
        </View>

        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>Bem-vindo!</Text>
          <Text style={[styles.cardText, { color: theme.colors.text.secondary }]}>
            Gerencie suas motos e vagas do pátio de forma inteligente. Acompanhe o status do pátio em tempo real, cadastre novas motos e mantenha tudo sob controle com praticidade e segurança.
          </Text>
        </Card>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <MaterialIcons name="local-parking" size={32} color={theme.colors.primary} style={styles.statIcon} />
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{totalVagas}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Vagas Totais</Text>
          </Card>
          <Card style={styles.statCard}>
            <MaterialIcons name="two-wheeler" size={32} color={theme.colors.primary} style={styles.statIcon} />
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{motosAtivas}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Motos Ativas</Text>
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
          <Text style={[styles.tipsTitle, { color: theme.colors.primary }]}>Dicas de Uso</Text>
          <Text style={[styles.tipsText, { color: theme.colors.text.secondary }]}>• Utilize o mapa para localizar rapidamente vagas e motos.
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
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    opacity: 0.7,
  },
  card: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '400',
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