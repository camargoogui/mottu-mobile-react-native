import api from './api';
import { Moto } from '../types';

// Funções de conversão entre status da UI e API
const statusToApiNumber = (status: 'disponível' | 'ocupada' | 'manutenção'): number => {
  switch (status) {
    case 'disponível': return 0;
    case 'ocupada': return 1;
    case 'manutenção': return 2;
    default: return 0; // Default para disponível
  }
};

const apiNumberToStatus = (statusNumber: number): 'disponível' | 'ocupada' | 'manutenção' => {
  switch (statusNumber) {
    case 0: return 'disponível';
    case 1: return 'ocupada';
    case 2: return 'manutenção';
    default: return 'disponível'; // Default para disponível
  }
};

// Adapter para converter dados da API para o formato do app
const adaptMotoFromApi = (apiMoto: any): Moto => {
  return {
    id: apiMoto.id.toString(),
    condutor: 'N/A', // API não tem condutor, usar valor padrão
    modelo: apiMoto.modelo,
    placa: apiMoto.placa,
    // Priorizar o status numérico se existir, senão usar o campo disponivel
    status: apiMoto.status !== undefined 
      ? apiNumberToStatus(apiMoto.status)
      : (apiMoto.disponivel ? 'disponível' : 'manutenção'),
    ano: apiMoto.ano,
    cor: apiMoto.cor,
    filialId: apiMoto.filialId,
    filialNome: apiMoto.filialNome,
    // Localização padrão se não fornecida
    localizacao: {
      latitude: -23.5505,
      longitude: -46.6333,
    },
  };
};

export interface CreateMotoRequest {
  placa: string; // Exatamente 7 caracteres
  modelo: string; // 2-50 caracteres
  ano: number; // 1900-2030
  cor: string; // 3-30 caracteres
  filialId: number; // ID da filial obrigatório
}

export interface UpdateMotoRequest extends CreateMotoRequest {
  id: string;
  status: number; // 0 = Disponível, 1 = Ocupada, 2 = Manutenção
}

export const MotoService = {
  // Listar todas as motos
  async getAll(): Promise<Moto[]> {
    try {
      const response = await api.get('/v1/moto?pageSize=50');
      console.log('📥 Resposta da API Motos:', response.data);
      
      // A API retorna { data: [], page: 1, ... }
      const motos = response.data.data || response.data;
      console.log('📋 Total de motos encontradas:', motos.length);
      
      return motos.map(adaptMotoFromApi);
    } catch (error) {
      console.error('Erro ao buscar motos:', error);
      throw new Error('Não foi possível carregar as motos. Verifique sua conexão.');
    }
  },

  // Listar motos por filial
  async getMotosByFilialId(filialId: string): Promise<Moto[]> {
    try {
      // Como a API não tem endpoint específico para motos por filial,
      // vamos buscar todas e filtrar pelo filialId
      const todasMotos = await this.getAll();
      const motosFilial = todasMotos.filter(moto => moto.filialId.toString() === filialId.toString());
      
      console.log(`📍 Motos encontradas na filial ${filialId}:`, motosFilial.length);
      return motosFilial;
    } catch (error) {
      console.error('Erro ao buscar motos da filial:', error);
      throw new Error('Não foi possível carregar as motos desta filial. Verifique sua conexão.');
    }
  },

  // Buscar moto por ID
  async getById(id: string): Promise<Moto> {
    try {
      const response = await api.get(`/v1/moto/${id}`);
      return adaptMotoFromApi(response.data);
    } catch (error) {
      console.error('Erro ao buscar moto:', error);
      throw new Error('Não foi possível carregar os detalhes da moto.');
    }
  },

  // Criar nova moto
  async create(moto: CreateMotoRequest): Promise<Moto> {
    try {
      const response = await api.post('/v1/moto', moto);
      return adaptMotoFromApi(response.data);
    } catch (error) {
      console.error('Erro ao criar moto:', error);
      throw new Error('Não foi possível cadastrar a moto. Tente novamente.');
    }
  },

  // Atualizar moto existente
  async update(id: string, moto: UpdateMotoRequest): Promise<Moto> {
    try {
      console.log('🚀 Dados sendo enviados para API:', JSON.stringify(moto, null, 2));
      console.log(`🌐 URL: PUT ${api.defaults.baseURL}/v1/moto/${id}`);
      
      const response = await api.put(`/v1/moto/${id}`, moto);
      
      console.log('✅ Resposta da API - Status:', response.status);
      console.log('✅ Dados retornados:', JSON.stringify(response.data, null, 2));
      
      return adaptMotoFromApi(response.data);
    } catch (error) {
      console.error('❌ Erro ao atualizar moto:', error);
      throw new Error('Não foi possível atualizar a moto. Tente novamente.');
    }
  },

  // Deletar moto
  async delete(id: string): Promise<void> {
    try {
      // Converte para int para garantir compatibilidade
      const motoId = parseInt(id);
      if (isNaN(motoId)) {
        throw new Error('❌ ID da moto inválido');
      }

      console.log(`🚀 Tentando deletar moto ID: ${motoId}`);
      console.log(`🌐 URL: ${api.defaults.baseURL}/v1/moto/${motoId}`);
      
      const response = await api.delete(`/v1/moto/${motoId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        timeout: 15000 // 15 segundos
      });
      
      console.log('✅ Moto deletada com sucesso:', response.status);
    } catch (error: any) {
      console.error('❌ Erro ao deletar moto:', error);
      console.log('📋 Status:', error.response?.status);
      console.log('📋 Data:', error.response?.data);
      console.log('📋 Headers:', error.response?.headers);
      console.log('📋 Config:', error.config);
      
      // Tratamento específico por status
      if (error.response?.status === 500) {
        const errorMessage = error.response?.data || '';
        console.log('🔍 Erro 500 detalhado:', errorMessage);
        
        // Verifica se é erro de relacionamento ou constraint
        if (errorMessage.includes('saving the entity changes') || 
            errorMessage.includes('constraint') ||
            errorMessage.includes('foreign key') ||
            errorMessage.includes('FOREIGN KEY')) {
          throw new Error('❌ Não é possível excluir esta moto.\n\n💡 Possíveis motivos:\n• Moto possui manutenções registradas\n• Moto está vinculada a outros registros\n• Remova as dependências primeiro');
        }
        
        throw new Error('❌ Erro interno do servidor.\n\n📋 Detalhes técnicos:\n' + (typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)));
      }
      
      if (error.response?.status === 404) {
        throw new Error('❌ Moto não encontrada (ID: ' + id + ')');
      }
      
      if (error.response?.status === 204 || error.response?.status === 200) {
        // Sucesso, mas algo deu errado no catch
        console.log('✅ Deleção bem-sucedida, mas caiu no catch');
        return;
      }
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('⏰ Timeout: Operação demorou muito para completar');
      }
      
      throw new Error(`❌ Erro na exclusão (${error.response?.status || 'SEM_STATUS'}):\n${error.message}`);
    }
  },
};

