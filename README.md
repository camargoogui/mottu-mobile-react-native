# 🏍 Mottu Mobile React Native - Gestão Inteligente de Pátio

Aplicativo mobile desenvolvido em React Native com Expo para gestão inteligente do pátio de motos da Mottu, com integração completa à API .NET e sistema de autenticação Firebase.

## 🎥 Vídeo Demonstrativo

[Link para o vídeo no YouTube](https://youtu.be/cWPtQ3FW5p0)

## 👥 Integrantes

- **RM556270** - Bianca Vitoria - 2TDSPZ | https://github.com/biancavitoria15
- **RM555166** - Guilherme Camargo - 2TDSPM | https://github.com/camargoogui
- **RM555131** - Icaro Americo - 2TDSPM | https://github.com/icaroalb1

## 🚀 Tecnologias

### Core
- **React Native** 0.79.5
- **Expo** 53.0.22
- **TypeScript** 5.8.3
- **React Navigation** 7.x

### Autenticação & Backend
- **Firebase Authentication** 12.2.1
- **Axios** 1.12.2 (Integração API .NET)
- **AsyncStorage** 2.1.2
- **Expo Notifications** 0.32.12 (Notificações locais)

### Internacionalização
- **react-i18next** 16.2.1
- **i18next** 25.6.0

### UI/UX
- **Material Icons** (@expo/vector-icons)
- **Apple Human Interface Guidelines**
- **Sistema de Temas** (Modo Claro/Escuro)

## 📱 Funcionalidades Implementadas

### 🔐 Sistema de Autenticação
- **Login/Cadastro** com Firebase Authentication
- **Validação de formulários** em tempo real
- **Persistência de sessão** com AsyncStorage
- **Logout seguro** com limpeza de dados

### 🔔 Notificações Locais
- **Notificações locais** com Expo Notifications
- **Solicitação de permissões** iOS/Android
- **Notificações automáticas** em todas as operações CRUD:
  - 🏍️ **Motos**: Criar, Atualizar, Excluir
  - 🏢 **Filiais**: Criar, Atualizar, Excluir, Ativar/Desativar
- **Handlers customizáveis** para foreground/background
- **Deep linking** preparado para futuras implementações
- **Delay configurável** (2 segundos por padrão)

### 🌐 Internacionalização (i18n)
- **Suporte a múltiplos idiomas**: Português (Brasil), English e Español
- **Persistência de preferência** do usuário
- **Seleção de idioma** na tela de Login e Configurações
- **Tradução completa** de todas as telas e componentes
- **Tradução de validações**, mensagens de erro, alertas e notificações

### 🏍️ CRUD Completo de Motos
- **Listar Motos** com integração à API .NET
- **Cadastrar Moto** com validações robustas
- **Editar Moto** com atualização de status
- **Deletar Moto** com confirmação e tratamento de erros
- **Fallback local** quando API não disponível

### 🏢 CRUD Completo de Filiais
- **Listar Filiais** com status ativo/inativo
- **Cadastrar Filial** com campos completos
- **Editar Filial** com validações específicas
- **Deletar Filial** com verificação de relacionamentos
- **Toggle Status** para ativar/desativar filiais

### 🎨 Sistema de Temas Avançado
- **Modo Claro/Escuro** com persistência
- **Apple HIG Colors** (60+ cores definidas)
- **Tipografia SF Pro** (12 estilos)
- **Componentes adaptativos** que respondem ao tema
- **Toggle na tela de configurações**

### 🌐 Sistema de Idiomas
- **Idiomas suportados**: Português (Brasil) e English
- **Detecção automática** baseada no idioma do dispositivo
- **Seleção de idioma** disponível em Login e Configurações
- **Persistência** da preferência do usuário no AsyncStorage
- **Tradução completa** de todas as strings do aplicativo

### 🔧 Funcionalidades Técnicas
- **Integração API .NET** com endpoints completos
- **Tratamento de erros** específico por tipo
- **Estados de carregamento** em todas as operações
- **Validações de formulário** robustas
- **Navegação tipada** com React Navigation
- **Arquitetura modular** bem estruturada

## 🔧 Como Rodar o Projeto

### 1. Pré-requisitos
- Node.js 18+
- Expo CLI
- Dispositivo móvel com Expo Go ou emulador
- **API .NET**: [mottu-api-dotnet](https://github.com/camargoogui/mottu-api-dotnet.git) (obrigatória para testar endpoints)

### 2. Instalação
```bash
# Clone o repositório
git clone https://github.com/camargoogui/mottu-mobile-react-native

# Navegue para o diretório
cd mottu-mobile-react-native

# Instale as dependências
npm install
```

### 3. Configuração da API

#### 3.1. Configuração do IP
```bash
# Configure o IP da API em src/config/api.ts
# O IP é detectado automaticamente por plataforma:
# - Emulador Android: 10.0.2.2 (automático)
# - iOS Simulator: localhost (automático)
# - Dispositivo físico: IP configurado manualmente

# Para descobrir seu IP:
# macOS/Linux: ifconfig | grep "inet "
# Windows: ipconfig
```

#### 3.2. Configuração da API Key
```bash
# A API Key padrão é 'local-dev-key'
# Configure via variável de ambiente ou edite src/config/api.ts:
# EXPO_PUBLIC_API_KEY=sua-api-key-aqui

# Ou edite diretamente em src/config/api.ts:
# API_KEY: process.env.EXPO_PUBLIC_API_KEY || 'local-dev-key',
```

**⚠️ IMPORTANTE**: A API Key é enviada automaticamente em todas as requisições via headers `X-API-Key` e `ApiKey`.

### 4. Execução
```bash
# Inicie o projeto
npm start

# Ou execute diretamente
npm run android  # Para Android
npm run ios      # Para iOS
```

### 5. Configuração da API .NET

**⚠️ IMPORTANTE**: Para testar os endpoints, você precisa rodar a API .NET junto com o app mobile.

#### 5.1. Clone e Configure a API
```bash
# Clone o repositório da API
git clone https://github.com/camargoogui/mottu-api-dotnet.git
cd mottu-api-dotnet

# Navegue para a pasta da aplicação
cd MottuApi/MottuApi.Presentation

# Execute a API
dotnet run --urls "http://0.0.0.0:5001"
```

#### 5.2. Verificar se a API está funcionando
```bash
# Teste se a API está respondendo
curl -X GET "http://localhost:5001/api/filial"

# Ou acesse o Swagger para ver todos os endpoints
open http://localhost:5001
```

#### 5.3. Configurar o IP no App Mobile
```bash
# Configure o IP da API em src/services/api.ts
const baseURL = 'http://SEU_IP_LOCAL:5001/api';

# Para descobrir seu IP:
# macOS/Linux: ifconfig | grep "inet "
# Windows: ipconfig
```

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── Button.tsx      # Botão com variantes (primary, secondary, etc.)
│   ├── Card.tsx        # Card com variantes (elevated, filled, outlined)
│   └── Input.tsx       # Input com validações e ícones
├── contexts/            # Contextos globais
│   ├── AuthContext.tsx  # Gerenciamento de autenticação
│   ├── ThemeContext.tsx # Sistema de temas
│   └── LanguageContext.tsx # Gerenciamento de idiomas
├── i18n/                # Configuração de internacionalização
│   ├── index.ts         # Configuração i18next
│   ├── locales/         # Arquivos de tradução
│   │   ├── pt-BR.json   # Traduções em português
│   │   ├── en.json       # Traduções em inglês
│   │   └── es.json       # Traduções em espanhol
│   └── utils.ts         # Utilitários de tradução
├── navigation/          # Configuração de navegação
│   └── index.tsx       # Stack e Tab navigators tipados
├── screens/             # Telas da aplicação
│   ├── LoginScreen.tsx     # Tela de login (com seleção de idioma)
│   ├── RegisterScreen.tsx  # Tela de cadastro
│   ├── Home.tsx           # Tela inicial
│   ├── ListaMotos.tsx     # Lista de motos
│   ├── CadastroMoto.tsx   # Cadastro de moto (com notificação)
│   ├── EdicaoMoto.tsx     # Edição de moto
│   ├── DetalhesMoto.tsx   # Detalhes da moto
│   ├── FilialListScreen.tsx    # Lista de filiais
│   ├── FilialFormScreen.tsx    # Formulário de filial
│   ├── MotosFilialScreen.tsx   # Motos por filial
│   ├── FormularioManutencao.tsx # Formulário de manutenção
│   ├── ListaManutencoes.tsx     # Lista de manutenções
│   ├── MapaPatio.tsx           # Mapa do pátio
│   └── Configuracoes.tsx  # Configurações (tema, idioma, logout)
├── services/            # Serviços e integrações
│   ├── api.ts          # Configuração Axios (com API Key)
│   ├── authService.ts  # Serviço de autenticação Firebase
│   ├── motoService.ts  # CRUD de motos
│   ├── filialService.ts # CRUD de filiais
│   ├── firebase.ts     # Configuração Firebase
│   ├── storage.ts      # AsyncStorage
│   └── notifications/  # Serviço de notificações push
│       ├── index.ts    # Interface principal
│       ├── expoNotifications.client.ts # Cliente Expo
│       └── types.ts    # Tipos TypeScript
├── theme/              # Sistema de temas
│   └── index.ts        # Cores, tipografia e espaçamentos
└── types/              # Definições TypeScript
    └── index.ts        # Interfaces e tipos
```

## 🎨 Design System

### Sistema de Cores
- **Apple HIG Colors**: 60+ cores seguindo diretrizes da Apple
- **Cores Semânticas**: success, error, warning, info
- **Modo Escuro**: Cores otimizadas para visibilidade
- **Cores do Sistema**: systemBlue, systemGreen, etc.

### Tipografia
- **SF Pro Display/Text**: Seguindo Apple HIG
- **12 Estilos**: largeTitle, title1-3, headline, body, callout, etc.
- **Line Height**: Otimizado para legibilidade
- **Letter Spacing**: Seguindo especificações da Apple

### Componentes
- **Button**: 4 variantes (primary, secondary, tertiary, destructive)
- **Card**: 3 variantes (elevated, filled, outlined)
- **Input**: Validações, ícones, estados de foco
- **Responsivos**: Adaptam-se ao tema automaticamente

## 🔌 Integração com API .NET

### 📡 Repositório da API
**Link da API**: [https://github.com/camargoogui/mottu-api-dotnet.git](https://github.com/camargoogui/mottu-api-dotnet.git)

### Endpoints Implementados
- **Motos**: GET, POST, PUT, DELETE `/api/v1/moto`
  - GET `/api/v1/moto/por-placa?placa=ABC1234` (buscar por placa)
  - GET `/api/v1/moto/por-filial/{filialId}` (listar por filial)
  - PATCH `/api/v1/moto/{id}/disponivel` (marcar como disponível)
  - PATCH `/api/v1/moto/{id}/indisponivel` (marcar como indisponível)
- **Filiais**: GET, POST, PUT, DELETE `/api/v1/filial`
  - PATCH `/api/v1/filial/{id}/ativar` (ativar filial)
  - PATCH `/api/v1/filial/{id}/desativar` (desativar filial)

### Características
- **Timeout**: 10 segundos por requisição
- **API Key**: Autenticação via header (X-API-Key/ApiKey)
- **Interceptors**: Logging de requisições/respostas
- **Tratamento de Erros**: Mensagens específicas por status
- **Fallback Local**: Dados salvos localmente quando API falha

### 🚀 Como Testar a Integração

1. **Clone e execute a API .NET**:
   ```bash
   git clone https://github.com/camargoogui/mottu-api-dotnet.git
   cd mottu-api-dotnet/MottuApi/MottuApi.Presentation
   dotnet run --urls "http://0.0.0.0:5001"
   ```

2. **Configure o IP no app mobile**:
   ```bash
   # Em src/services/api.ts
   const baseURL = 'http://SEU_IP_LOCAL:5001/api';
   ```

3. **Execute o app mobile**:
   ```bash
   npm start
   ```

4. **Teste os endpoints** através do app ou pelo Swagger em `http://localhost:5001`

## 🏗️ Arquitetura

### Padrões Implementados
- **Separation of Concerns**: Componentes, serviços, contextos separados
- **TypeScript**: Tipagem forte em todo o projeto
- **Context API**: Gerenciamento de estado global
- **Custom Hooks**: Lógica reutilizável
- **Error Boundaries**: Tratamento robusto de erros

### Boas Práticas
- **Nomenclatura**: PascalCase para componentes, camelCase para funções
- **Estrutura**: Arquivos organizados por funcionalidade
- **Performance**: useCallback, useMemo quando necessário
- **Acessibilidade**: Labels e feedback visual adequados

## 🚀 Funcionalidades Avançadas

### Sistema de Temas
- **Persistência**: Tema salvo no AsyncStorage
- **Toggle Dinâmico**: Mudança instantânea sem reload
- **Componentes Adaptativos**: Todos respondem ao tema
- **Cores Contextuais**: Adaptação automática de cores

### Tratamento de Erros
- **Específico por Tipo**: Diferentes mensagens por erro
- **Fallback Inteligente**: Dados locais quando API falha
- **Logging Detalhado**: Console logs para debugging
- **UX Amigável**: Alertas informativos para o usuário

### Validações
- **Tempo Real**: Validação durante digitação
- **Específicas**: Regras por tipo de campo
- **Mensagens Claras**: Feedback traduzido no idioma selecionado
- **Prevenção**: Bloqueio de envio com dados inválidos

### Internacionalização
- **Idiomas Disponíveis**: Português (Brasil), English e Español
- **Detecção Automática**: Usa o idioma do sistema
- **Persistência**: Salva preferência do usuário
- **Cobertura Completa**: Todas as telas, labels, placeholders, mensagens e notificações traduzidas
- **Troca Dinâmica**: Mudança de idioma sem reiniciar o app

## 📱 Compatibilidade

- **iOS**: 13.0+
- **Android**: API 21+ (Android 5.0)
- **Expo**: 53.0.22
- **React Native**: 0.79.5

## 🔒 Segurança

- **Firebase Auth**: Autenticação segura
- **API Key**: Autenticação via header em todas as requisições
- **Token Management**: Renovação automática
- **Data Validation**: Validação client-side e server-side
- **Secure Storage**: AsyncStorage para dados sensíveis
- **Headers Seguros**: API Key enviada automaticamente via interceptors

---

## 📞 Suporte

Para dúvidas ou problemas:
- **Documentação**: Consulte os arquivos README específicos
- **API**: Verifique se a API .NET está rodando na porta 5001

**Desenvolvido com ❤️ para o desafio Mottu**
