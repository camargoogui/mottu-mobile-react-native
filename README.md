# 🏍 Mottu Challenge - Gestão de Pátio

Aplicativo mobile desenvolvido em React Native com Expo para gestão inteligente do pátio de motos da Mottu.

## 👥 Integrantes

- RM556270 - Bianca Vitoria - 2TDSPZ
- RM555166 - Guilherme Camargo - 2TDSPM
- RM555131 - Icaro Americo - 2TDSPM

## 🚀 Tecnologias

- React Native
- Expo
- TypeScript
- React Navigation
- AsyncStorage
- Componentes customizados

## 📱 Funcionalidades

1. **Home**
   - Tela inicial com acesso ao mapa e lista de motos
   - Interface limpa e intuitiva

2. **Mapa do Pátio**
   - Visualização das vagas em tempo real
   - Status: livre (verde) ou ocupada (vermelho)
   - Acesso rápido aos detalhes da moto

3. **Lista de Motos**
   - Listagem de todas as motos cadastradas
   - Filtro por status
   - Acesso aos detalhes

4. **Cadastro de Moto**
   - Formulário completo com validações
   - Preview em tempo real
   - Campos:
     - Nome do condutor
     - Modelo da moto
     - Placa
     - Vaga

5. **Detalhes da Moto**
   - Informações completas
   - Histórico de manutenções
   - Opções de edição

## 🔧 Como Rodar o Projeto

1. Clone o repositório:
```bash
git clone https://github.com/camargoogui/Mobile---Challenge
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o projeto:
```bash
npm start
```

4. Use o Expo Go no seu celular ou um emulador para rodar o app

## 📁 Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── navigation/     # Configuração de rotas
  ├── screens/        # Telas do app
  ├── services/       # Serviços (Storage, API)
  ├── theme/          # Estilos globais
  └── types/          # Tipagens TypeScript
```

## 🎨 Design System

- Cores consistentes
- Tipografia hierárquica
- Componentes reutilizáveis
- Feedback visual
- Validações em tempo real

## 📝 Solução

O app foi desenvolvido seguindo as melhores práticas de React Native, com foco em:

1. **Componentização**
   - Componentes reutilizáveis
   - Props tipadas
   - Estilos consistentes

2. **Gerenciamento de Estado**
   - useState para formulários
   - Context API quando necessário
   - AsyncStorage para persistência

3. **Navegação**
   - Stack Navigator para fluxos
   - Tab Navigator para navegação principal
   - Tipagem forte nas rotas

4. **UX/UI**
   - Feedback visual
   - Validações em tempo real
   - Interface intuitiva
   - Cores significativas

5. **Código**
   - TypeScript
   - ESLint
   - Prettier
   - Comentários relevantes # Mobile---Challenge
