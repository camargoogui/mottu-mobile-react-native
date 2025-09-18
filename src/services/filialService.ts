import api from './api';
import { Filial } from '../types';

export interface CreateFilialRequest {
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone?: string;
  email?: string;
  coordenadas?: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
}

export interface UpdateFilialRequest extends CreateFilialRequest {
  id: string;
  ativa: boolean;
}

export const FilialService = {
  // Listar todas as filiais
  async getAll(): Promise<Filial[]> {
    try {
      const response = await api.get('/Filial');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar filiais:', error);
      throw new Error('Não foi possível carregar as filiais. Verifique sua conexão.');
    }
  },

  // Buscar filial por ID
  async getById(id: string): Promise<Filial> {
    try {
      const response = await api.get(`/Filial/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar filial:', error);
      throw new Error('Não foi possível carregar os detalhes da filial.');
    }
  },

  // Criar nova filial
  async create(filial: CreateFilialRequest): Promise<Filial> {
    try {
      const response = await api.post('/Filial', filial);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar filial:', error);
      throw new Error('Não foi possível cadastrar a filial. Tente novamente.');
    }
  },

  // Atualizar filial existente
  async update(id: string, filial: UpdateFilialRequest): Promise<Filial> {
    try {
      const response = await api.put(`/Filial/${id}`, filial);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar filial:', error);
      throw new Error('Não foi possível atualizar a filial. Tente novamente.');
    }
  },

  // Deletar filial
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/Filial/${id}`);
    } catch (error) {
      console.error('Erro ao deletar filial:', error);
      throw new Error('Não foi possível excluir a filial. Tente novamente.');
    }
  },

  // Ativar/desativar filial
  async toggleActive(id: string): Promise<Filial> {
    try {
      const response = await api.patch(`/Filial/${id}/toggle-active`);
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar status da filial:', error);
      throw new Error('Não foi possível alterar o status da filial.');
    }
  },
};

