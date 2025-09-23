# Integração com API .NET - Guia de Configuração

Este documento descreve como a integração com a API .NET foi implementada no aplicativo React Native.

## 📋 Resumo da Implementação

### ✅ Funcionalidades Implementadas

#### CRUD Completo de Motos
- **✅ Listar Motos (GET /Moto)**: Tela `ListaMotos` com refresh e fallback para dados locais
- **✅ Criar Moto (POST /Moto)**: Formulário `CadastroMoto` com validação e feedback
- **✅ Atualizar Moto (PUT /Moto/{id})**: Suporte a edição (estrutura preparada)
- **✅ Deletar Moto (DELETE /Moto/{id})**: Botão de exclusão com confirmação

#### CRUD Completo de Filiais (Nova Funcionalidade)
- **✅ Listar Filiais (GET /Filial)**: Tela `FilialListScreen` 
- **✅ Criar Filial (POST /Filial)**: Formulário `FilialFormScreen`
- **✅ Atualizar Filial (PUT /Filial/{id})**: Edição completa de filiais
- **✅ Deletar Filial (DELETE /Filial/{id})**: Exclusão com confirmação
- **✅ Ativar/Desativar Filial (PATCH /Filial/{id}/toggle-active)**: Toggle de status

## 🔧 Configuração da API

### ✅ Configuração Automática (Recomendado)

O app agora detecta automaticamente o IP correto para cada plataforma:

- **📱 Emulador Android**: `10.0.2.2:5001` (automático)
- **🍎 iOS Simulator**: `localhost:5001` (automático)  
- **📱 Dispositivo Físico**: IP detectado automaticamente

### 🚀 Comandos para Configuração

#### **Opção 1: Comando Único (Recomendado)**
```bash
npm run dev
```
Este comando:
1. ✅ Detecta seu IP automaticamente
2. ✅ Atualiza a configuração da API
3. ✅ Inicia o app React Native

#### **Opção 2: Scripts Separados**
```bash
# Atualizar IP automaticamente
npm run update-api

# Ver IP atual
npm run get-ip

# Iniciar app
npm start
```

### 📁 Configuração Manual (Apenas se necessário)

Para dispositivos físicos, edite `src/config/api.ts`:

```typescript
// Linha 25 - substitua pelo seu IP atual
return '192.168.68.106'; // ← Seu IP aqui
```

### 🔍 Como Descobrir Seu IP

#### **Via Script (Recomendado):**
```bash
npm run get-ip
```

#### **Manual:**
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

## 📱 Funcionalidades por Tela

### Tela Lista de Motos (`src/screens/ListaMotos.tsx`)
- **Loading State**: Indicador de carregamento durante requisições
- **Pull-to-Refresh**: Puxar para baixo para atualizar
- **Fallback Local**: Se a API falhar, carrega dados do AsyncStorage
- **Botão Deletar**: Cada moto tem botão de exclusão com confirmação
- **Estado Vazio**: Mensagem quando não há motos

### Tela Cadastro de Moto (`src/screens/CadastroMoto.tsx`)
- **Validação**: Campos obrigatórios e formato de placa
- **Feedback Visual**: Loading durante envio e mensagens de sucesso/erro
- **Fallback Local**: Se API falhar, salva localmente
- **Preview**: Visualização dos dados antes de salvar

### Tela Lista de Filiais (`src/screens/Filiais/FilialListScreen.tsx`)
- **CRUD Completo**: Listar, criar, editar, deletar
- **Toggle Status**: Ativar/desativar filiais
- **Refresh**: Atualização manual da lista
- **Navegação**: Acesso via tab "Filiais" ou botão na Home

### Tela Formulário de Filial (`src/screens/Filiais/FilialFormScreen.tsx`)
- **Campos Completos**: Nome, endereço, cidade, estado, CEP, telefone, email
- **Coordenadas**: Latitude, longitude e altitude (opcional)
- **Validação**: CEP, email, coordenadas numéricas
- **Edição**: Suporte completo para editar filiais existentes

## 🔄 Fluxo de Dados

### Estratégia de Fallback
1. **Primeira tentativa**: Busca dados da API
2. **Em caso de erro**: 
   - Mostra alerta informativo
   - Carrega dados locais (AsyncStorage)
   - Permite operação offline limitada

### Tratamento de Erros
- **Timeout**: 10 segundos por requisição
- **Mensagens amigáveis**: Erros traduzidos para português
- **Logs detalhados**: Console logs para debugging

## 🚀 Como Testar

### 1. Iniciar o Aplicativo
```bash
npm run android
# ou
npm run ios
```

### 2. Testar Conectividade
- Abra a tela "Lista de Motos"
- Se aparecer "Carregando motos..." seguido de dados, a API está funcionando
- Se aparecer alerta sobre "dados locais", verifique a configuração da API

### 3. Testar CRUD de Motos
- **Criar**: Use o botão "Cadastrar Moto"
- **Listar**: Veja a lista na tela principal
- **Deletar**: Use o ícone de lixeira em cada moto

### 4. Testar CRUD de Filiais
- **Acessar**: Tab "Filiais" ou botão "Gerenciar Filiais" na Home
- **Criar**: Botão "Nova Filial"
- **Editar**: Toque em qualquer filial da lista
- **Deletar**: Ícone de lixeira
- **Toggle**: Ícone de olho para ativar/desativar

## 📋 Estrutura dos Dados

### Moto (API)
```typescript
interface Moto {
  id: string;
  condutor: string;
  modelo: string;
  placa: string;
  vaga?: string;
  status: 'disponível' | 'ocupada' | 'manutenção';
  localizacao: {
    latitude: number;
    longitude: number;
  };
}
```

### Filial (API)
```typescript
interface Filial {
  id: string;
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
  ativa: boolean;
  dataCriacao: string;
  dataAtualizacao?: string;
}
```

## 🛠️ Arquivos Criados/Modificados

### Novos Arquivos
- `src/services/api.ts` - Configuração do Axios
- `src/services/motoService.ts` - Serviço para API de Motos
- `src/services/filialService.ts` - Serviço para API de Filiais
- `src/screens/Filiais/FilialListScreen.tsx` - Lista de filiais
- `src/screens/Filiais/FilialFormScreen.tsx` - Formulário de filiais

### Arquivos Modificados
- `src/types/index.ts` - Adicionada interface Filial
- `src/screens/ListaMotos.tsx` - Integração com API
- `src/screens/CadastroMoto.tsx` - Integração com API
- `src/navigation/index.tsx` - Navegação para filiais
- `src/screens/Home.tsx` - Botão para acessar filiais

## 🔍 Debugging

### Logs da API
Os logs aparecem no console do React Native:
```
🚀 API Request: GET http://192.168.68.106:5001/api/Moto
✅ API Response: 200 GET /Moto
📥 Response Data: [...]
```

### Problemas Comuns
1. **"Network Error"**: 
   - Execute `npm run update-api` para atualizar o IP
   - Verifique se a API está rodando: `dotnet run --urls "http://0.0.0.0:5001"`
2. **Timeout**: API demorou mais de 10 segundos para responder
3. **CORS**: Configure CORS na API .NET se necessário
4. **IP Mudou**: Execute `npm run dev` para detectar e atualizar automaticamente

## 📱 Navegação

### Estrutura de Tabs
- **Home**: Tela inicial com estatísticas
- **Motos**: CRUD completo de motos
- **Filiais**: CRUD completo de filiais (NOVO)
- **Configurações**: Configurações do app

### Acesso às Filiais
1. **Tab Filiais**: Acesso direto via bottom tab
2. **Botão na Home**: "Gerenciar Filiais"

---

## 🎯 Próximos Passos

Para usar a integração:

1. **Execute `npm run dev`** para configuração automática
2. **Teste todas as funcionalidades** com a API rodando
3. **Ajuste validações** conforme necessário
4. **Implemente autenticação** se a API exigir
5. **Configure CORS** na API .NET se necessário

## 📚 Documentação Adicional

- **`API_CONFIG_GUIDE.md`**: Guia completo de configuração automática
- **`scripts/`**: Scripts para detecção e atualização de IP
- **`src/config/api.ts`**: Configuração centralizada da API

A integração está completa e pronta para uso! 🚀
