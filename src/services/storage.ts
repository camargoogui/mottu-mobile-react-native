import AsyncStorage from '@react-native-async-storage/async-storage';
import { Moto, Vaga, Manutencao } from '../types';

const MOTOS_KEY = '@motos';
const VAGAS_KEY = '@vagas';
const MANUTENCOES_KEY = '@manutencoes';

export const StorageService = {
  // Motos
  async getMotos(): Promise<Moto[]> {
    try {
      const data = await AsyncStorage.getItem(MOTOS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar motos:', error);
      return [];
    }
  },

  async saveMoto(moto: Moto): Promise<void> {
    try {
      const motos = await this.getMotos();
      const newMotos = [...motos, moto];
      await AsyncStorage.setItem(MOTOS_KEY, JSON.stringify(newMotos));
    } catch (error) {
      console.error('Erro ao salvar moto:', error);
    }
  },

  async updateMoto(moto: Moto): Promise<void> {
    try {
      const motos = await this.getMotos();
      const newMotos = motos.map(m => m.id === moto.id ? moto : m);
      await AsyncStorage.setItem(MOTOS_KEY, JSON.stringify(newMotos));
    } catch (error) {
      console.error('Erro ao atualizar moto:', error);
    }
  },

  // Vagas
  async getVagas(): Promise<Vaga[]> {
    try {
      const data = await AsyncStorage.getItem(VAGAS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
      return [];
    }
  },

  async updateVaga(vaga: Vaga): Promise<void> {
    try {
      const vagas = await this.getVagas();
      const newVagas = vagas.map(v => v.id === vaga.id ? vaga : v);
      await AsyncStorage.setItem(VAGAS_KEY, JSON.stringify(newVagas));
    } catch (error) {
      console.error('Erro ao atualizar vaga:', error);
    }
  },

  // Manutenções
  async getManutencoes(): Promise<Manutencao[]> {
    try {
      const data = await AsyncStorage.getItem(MANUTENCOES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar manutenções:', error);
      return [];
    }
  },

  async saveManutencao(manutencao: Manutencao): Promise<void> {
    try {
      const manutencoes = await this.getManutencoes();
      const newManutencoes = [...manutencoes, manutencao];
      await AsyncStorage.setItem(MANUTENCOES_KEY, JSON.stringify(newManutencoes));
    } catch (error) {
      console.error('Erro ao salvar manutenção:', error);
    }
  },

  async getManutencoesByMotoId(motoId: string): Promise<Manutencao[]> {
    try {
      const manutencoes = await this.getManutencoes();
      return manutencoes.filter(m => m.motoId === motoId);
    } catch (error) {
      console.error('Erro ao buscar manutenções da moto:', error);
      return [];
    }
  },

  async deleteManutencao(manutencaoId: string): Promise<void> {
    try {
      const manutencoes = await this.getManutencoes();
      const newManutencoes = manutencoes.filter(m => m.id !== manutencaoId);
      await AsyncStorage.setItem(MANUTENCOES_KEY, JSON.stringify(newManutencoes));
    } catch (error) {
      console.error('Erro ao deletar manutenção:', error);
    }
  },

  // Inicialização com dados mockados
  async initializeMockData(): Promise<void> {
    // Gerar 80 vagas distribuídas em 10 colunas (A-J), 8 vagas por coluna
    const colunas = 'ABCDEFGHIJ'.split('');
    const totalVagas = 80;
    const vagas: Vaga[] = [];
    const motos: Moto[] = [];
    let motoId = 1;
    let vagaIndex = 0;
    for (let c = 0; c < colunas.length; c++) {
      for (let n = 1; n <= 8; n++) {
        const numero = `${colunas[c]}${n}`;
        const ocupada = Math.random() < 0.35; // 35% das vagas ocupadas
        let motoIdStr: string | undefined = undefined;
        if (ocupada) {
          motoIdStr = String(motoId);
          motos.push({
            id: motoIdStr,
            condutor: `Condutor ${motoId}`,
            modelo: `Modelo ${motoId}`,
            placa: `ABC${1000 + motoId}`,
            status: 'ocupada',
            vaga: numero,
            localizacao: { latitude: -23.55 + c * 0.001, longitude: -46.63 - n * 0.001 },
          });
          motoId++;
        }
        vagas.push({
          id: numero,
          numero,
          status: ocupada ? 'ocupada' : 'livre',
          localizacao: { latitude: -23.55 + c * 0.001, longitude: -46.63 - n * 0.001 },
          motoId: motoIdStr,
        });
        vagaIndex++;
      }
    }
    // Adiciona algumas motos livres
    for (let i = 0; i < 5; i++) {
      motos.push({
        id: String(motoId),
        condutor: `Condutor ${motoId}`,
        modelo: `Modelo ${motoId}`,
        placa: `LIV${1000 + motoId}`,
        status: 'disponível',
        localizacao: { latitude: -23.56, longitude: -46.62 },
      });
      motoId++;
    }
    await AsyncStorage.setItem(MOTOS_KEY, JSON.stringify(motos));
    await AsyncStorage.setItem(VAGAS_KEY, JSON.stringify(vagas));
  },
}; 