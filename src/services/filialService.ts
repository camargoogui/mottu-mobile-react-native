import api from './api';
import { Filial } from '../types';

export interface CreateFilialRequest {
  nome: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
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

// Adapter para converter dados da API para o formato do app
const adaptFilialFromApi = (apiFilial: any): Filial => {
  return {
    id: apiFilial.id.toString(),
    nome: apiFilial.nome,
    endereco: `${apiFilial.logradouro}, ${apiFilial.numero}${apiFilial.complemento ? ` - ${apiFilial.complemento}` : ''}`,
    logradouro: apiFilial.logradouro,
    numero: apiFilial.numero,
    complemento: apiFilial.complemento,
    bairro: apiFilial.bairro,
    cidade: apiFilial.cidade,
    estado: apiFilial.estado,
    cep: apiFilial.cep,
    telefone: apiFilial.telefone || undefined,
    email: undefined, // API não tem email
    coordenadas: undefined, // API não tem coordenadas
    ativa: apiFilial.ativo,
    dataCriacao: apiFilial.dataCriacao,
    dataAtualizacao: apiFilial.dataAtualizacao,
  };
};


export const FilialService = {
  // Listar todas as filiais
  async getAll(): Promise<Filial[]> {
    try {
      // Buscar com pageSize maior para ver todas as filiais
      const response = await api.get('/v1/filial?pageSize=50');
      console.log('📥 Resposta completa da API:', response.data);
      
      // A API retorna { data: [], page: 1, ... }
      const filiais = response.data.data || response.data;
      console.log('📋 Total de filiais encontradas:', filiais.length);
      
      return filiais.map(adaptFilialFromApi);
    } catch (error) {
      console.error('Erro ao buscar filiais:', error);
      throw new Error('Não foi possível carregar as filiais. Verifique sua conexão.');
    }
  },

  // Buscar filial por ID
  async getById(id: string): Promise<Filial> {
    try {
      const response = await api.get(`/v1/filial/${id}`);
      return adaptFilialFromApi(response.data);
    } catch (error) {
      console.error('Erro ao buscar filial:', error);
      throw new Error('Não foi possível carregar os detalhes da filial.');
    }
  },

  // Criar nova filial
  async create(filial: CreateFilialRequest): Promise<Filial> {
    try {
      console.log('📤 Dados enviados para API:', filial);
      const response = await api.post('/v1/filial', filial);
      return adaptFilialFromApi(response.data);
    } catch (error: any) {
      console.error('Erro ao criar filial:', error);
      
      // Tratamento específico para diferentes tipos de erro
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || 
                           error.response.data || 
                           'Dados inválidos. Verifique os campos obrigatórios.';
        throw new Error(errorMessage);
      }
      
      if (error.response?.status === 500) {
        throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
      }
      
      throw new Error('Não foi possível cadastrar a filial. Verifique sua conexão.');
    }
  },

  // Atualizar filial existente
  async update(id: string, filial: UpdateFilialRequest): Promise<Filial> {
    try {
      const response = await api.put(`/v1/filial/${id}`, filial);
      return adaptFilialFromApi(response.data);
    } catch (error) {
      console.error('Erro ao atualizar filial:', error);
      throw new Error('Não foi possível atualizar a filial. Tente novamente.');
    }
  },

  // Deletar filial
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/v1/filial/${id}`);
    } catch (error: any) {
      console.error('Erro ao deletar filial:', error);
      console.log('📋 Detalhes do erro:', error.response?.data);
      
      // Tratamento específico para erro de relacionamento
      if (error.response?.status === 500) {
        const errorMessage = error.response?.data || '';
        
        // Verifica se é erro de relacionamento com motos
        if (errorMessage.includes('association between entity types') || 
            errorMessage.includes('Filial') && errorMessage.includes('Moto')) {
          throw new Error('❌ Não é possível excluir esta filial pois ela possui motos associadas.\n\n💡 Para excluir esta filial:\n1. Primeiro remova ou transfira todas as motos\n2. Depois tente excluir a filial novamente');
        }
        
        throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
      }
      
      if (error.response?.status === 404) {
        throw new Error('Filial não encontrada.');
      }
      
      throw new Error('Não foi possível excluir a filial. Verifique sua conexão e tente novamente.');
    }
  },

  // Ativar/desativar filial
  async toggleActive(id: string): Promise<Filial> {
    try {
      const response = await api.patch(`/v1/filial/${id}/ativar`);
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar status da filial:', error);
      throw new Error('Não foi possível alterar o status da filial.');
    }
  },
};

