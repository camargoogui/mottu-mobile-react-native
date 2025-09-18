import api from './api';
import { Moto } from '../types';

export interface CreateMotoRequest {
  condutor: string;
  modelo: string;
  placa: string;
  vaga?: string;
  localizacao: {
    latitude: number;
    longitude: number;
  };
}

export interface UpdateMotoRequest extends CreateMotoRequest {
  id: string;
  status: 'disponível' | 'ocupada' | 'manutenção';
}

export const MotoService = {
  // Listar todas as motos
  async getAll(): Promise<Moto[]> {
    try {
      const response = await api.get('/Moto');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar motos:', error);
      throw new Error('Não foi possível carregar as motos. Verifique sua conexão.');
    }
  },

  // Buscar moto por ID
  async getById(id: string): Promise<Moto> {
    try {
      const response = await api.get(`/Moto/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar moto:', error);
      throw new Error('Não foi possível carregar os detalhes da moto.');
    }
  },

  // Criar nova moto
  async create(moto: CreateMotoRequest): Promise<Moto> {
    try {
      const response = await api.post('/Moto', moto);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar moto:', error);
      throw new Error('Não foi possível cadastrar a moto. Tente novamente.');
    }
  },

  // Atualizar moto existente
  async update(id: string, moto: UpdateMotoRequest): Promise<Moto> {
    try {
      const response = await api.put(`/Moto/${id}`, moto);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar moto:', error);
      throw new Error('Não foi possível atualizar a moto. Tente novamente.');
    }
  },

  // Deletar moto
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/Moto/${id}`);
    } catch (error) {
      console.error('Erro ao deletar moto:', error);
      throw new Error('Não foi possível excluir a moto. Tente novamente.');
    }
  },
};

