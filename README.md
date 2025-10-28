# 🏍 Mottu Mobile React Native - Gestão Inteligente de Pátio

Aplicativo mobile desenvolvido em React Native com Expo para gestão inteligente do pátio de motos da Mottu, com integração completa à API .NET e sistema de autenticação Firebase.

## 🎥 Vídeo Demonstrativo

[Link para o vídeo no YouTube](https://youtu.be/cWPtQ3FW5p0)

## 👥 Integrantes

- **RM556270** - Bianca Vitoria - 2TDSPZ | https://github.com/biancavitoria15
- **RM555166** - Guilherme Camargo - 2TDSPM | https://github.com/camargoogui
- **RM555131** - Icaro Americo - 2TDSPM | https://github.com/icaroalb1

## 📚 Documentação Adicional

### Push Notifications
Para documentação completa sobre notificações push, veja:
- [PUSH_NOTIFICATIONS_README.md](./PUSH_NOTIFICATIONS_README.md)

Inclui:
- Setup e configuração
- Exemplos de código
- Integração com backend
- Scripts de teste
- Solução de problemas

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
- **Expo Notifications** 0.x (Push notifications)

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

### 🔔 Push Notifications
- **Notificações push** com Expo Notifications
- **Solicitação de permissões** iOS/Android
- **Deep linking** baseado em dados da notificação
- **Tela de debug** integrada para testes
- **Handlers customizáveis** para foreground/background

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
```bash
# Configure o IP da API em src/services/api.ts
const baseURL = 'http://SEU_IP_LOCAL:5001/api';

# Para descobrir seu IP:
# macOS/Linux: ifconfig | grep "inet "
# Windows: ipconfig
```

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
│   └── ThemeContext.tsx # Sistema de temas
├── navigation/          # Configuração de navegação
│   └── index.tsx       # Stack e Tab navigators tipados
├── screens/             # Telas da aplicação
│   ├── LoginScreen.tsx     # Tela de login
│   ├── RegisterScreen.tsx  # Tela de cadastro
│   ├── Home.tsx           # Tela inicial
│   ├── ListaMotos.tsx     # Lista de motos
│   ├── CadastroMoto.tsx   # Cadastro de moto
│   ├── FilialListScreen.tsx    # Lista de filiais
│   ├── FilialFormScreen.tsx    # Formulário de filial
│   └── Configuracoes.tsx  # Configurações e logout
├── services/            # Serviços e integrações
│   ├── api.ts          # Configuração Axios
│   ├── authService.ts  # Serviço de autenticação Firebase
│   ├── motoService.ts  # CRUD de motos
│   ├── filialService.ts # CRUD de filiais
│   ├── firebase.ts     # Configuração Firebase
│   └── storage.ts      # AsyncStorage
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
- **Motos**: GET, POST, PUT, DELETE `/api/Moto`
- **Filiais**: GET, POST, PUT, DELETE `/api/Filial`
- **Toggle Status**: PATCH `/api/Filial/{id}/toggle-active`

### Características
- **Timeout**: 10 segundos por requisição
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

## 📚 Documentação Adicional

- **[API_INTEGRATION_README.md](./API_INTEGRATION_README.md)** - Guia completo de integração

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
- **Mensagens Claras**: Feedback em português
- **Prevenção**: Bloqueio de envio com dados inválidos

## 📱 Compatibilidade

- **iOS**: 13.0+
- **Android**: API 21+ (Android 5.0)
- **Expo**: 53.0.22
- **React Native**: 0.79.5

## 🔒 Segurança

- **Firebase Auth**: Autenticação segura
- **Token Management**: Renovação automática
- **Data Validation**: Validação client-side e server-side
- **Secure Storage**: AsyncStorage para dados sensíveis

---

## 📞 Suporte

Para dúvidas ou problemas:
- **Documentação**: Consulte os arquivos README específicos
- **API**: Verifique se a API .NET está rodando na porta 5001

**Desenvolvido com ❤️ para o desafio Mottu**
