export type MotoType = 'Mottu Sport' | 'Mottu E' | 'Mottu Pop';
export type MotoStatus = 'disponível' | 'em manutenção';

export type TipoManutencao =
  | 'Troca de óleo'
  | 'Freios'
  | 'Pneus'
  | 'Corrente'
  | 'Sistema elétrico'
  | 'Suspensão'
  | 'Motor'
  | 'Embreagem'
  | 'Bateria'
  | 'Carburador/Injeção'
  | 'Outro';

export interface Coordenadas {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface FilialInfo {
  nome: string;
  cidade: string;
  coordenadas: Coordenadas;
}

export const FILIAIS: { [key: string]: Coordenadas } = {
  'Mottu Guarulhos': {
    latitude: -23.4544,
    longitude: -46.5333,
    altitude: 760
  },
  'Mottu São Miguel': {
    latitude: -23.4908,
    longitude: -46.4423,
    altitude: 750
  },
  'Mottu São Bernardo': {
    latitude: -23.6914,
    longitude: -46.5646,
    altitude: 760
  },
  'Mottu Interlagos': {
    latitude: -23.6815,
    longitude: -46.6999,
    altitude: 730
  },
  'Mottu Taboão da Serra': {
    latitude: -23.6260,
    longitude: -46.7917,
    altitude: 740
  },
  'Mottu Jandira': {
    latitude: -23.5273,
    longitude: -46.9026,
    altitude: 720
  },
  'Mottu Limão': {
    latitude: -23.5215,
    longitude: -46.7074,
    altitude: 760
  },
  'Mottu Escola': {
    latitude: -23.5895,
    longitude: -46.6322,
    altitude: 780
  }
};

export interface Localizacao {
  latitude: number;
  longitude: number;
}

export interface Moto {
  id: string;
  condutor: string;
  modelo: string;
  placa: string;
  status: 'disponível' | 'ocupada' | 'manutenção';
  ano: number;
  cor: string;
  filialId: number;
  filialNome: string;
  vaga?: string;
  localizacao: Localizacao;
}

export interface Vaga {
  id: string;
  numero: string;
  status: 'livre' | 'ocupada';
  localizacao: Localizacao;
  motoId?: string;
}

export interface Manutencao {
  id: string;
  motoId: string;
  tipoManutencao: TipoManutencao;
  motivoCustomizado?: string;
  data: string;
  observacoes: string;
}

export interface Configuracoes {
  filial: string;
}

// Interface para Filiais da API
export interface Filial {
  id: string;
  nome: string;
  endereco: string; // Campo combinado para exibição
  logradouro: string; // Campo separado da API
  numero: string; // Campo separado da API
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone?: string;
  email?: string;
  coordenadas?: Coordenadas;
  ativa: boolean;
  dataCriacao: string;
  dataAtualizacao?: string;
} 