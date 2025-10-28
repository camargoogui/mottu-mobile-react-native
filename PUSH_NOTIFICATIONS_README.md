# 🔔 Push Notifications - Documentação Completa

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Setup e Configuração](#setup-e-configuração)
- [Arquitetura](#arquitetura)
- [Uso Básico](#uso-básico)
- [Exemplos de Backend](#exemplos-de-backend)
- [Testes](#testes)
- [Solução de Problemas](#solução-de-problemas)

---

## 🎯 Visão Geral

Este projeto implementa notificações push usando **expo-notifications** (SDK 53). A implementação segue padrões clean code, é totalmente tipada e testável.

### Características

- ✅ Solicitação de permissões
- ✅ Obtenção de token de push
- ✅ Recebimento em foreground e background
- ✅ Deep linking baseado em dados da notificação
- ✅ Tela de debug integrada
- ✅ Handlers customizáveis

---

## ⚙️ Setup e Configuração

### 1. Dependências Instaladas

```bash
npm install expo-notifications
```

### 2. Configuração do `app.json`

Já configurado com:
- Plugin `expo-notifications`
- Permissões Android (`POST_NOTIFICATIONS`)
- Project ID do EAS

```json
{
  "plugins": [
    ["expo-notifications", {
      "icon": "./assets/icon.png",
      "color": "#4CAF50"
    }]
  ],
  "android": {
    "permissions": ["POST_NOTIFICATIONS"]
  },
  "extra": {
    "eas": {
      "projectId": "your-project-id"
    }
  }
}
```

### 3. Permissões no AndroidManifest.xml

Já adicionado:
```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
```

### 4. Configuração do Project ID (EAS)

**IMPORTANTE**: Você precisa configurar o Project ID real para testar em dispositivos.

1. Crie um projeto no [Expo EAS](https://expo.dev)
2. Obtenha o Project ID
3. Atualize em `app.json`:

```json
"extra": {
  "eas": {
    "projectId": "seu-project-id-aqui"
  }
}
```

---

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/
├── services/
│   └── notifications/
│       ├── index.ts                 # API principal do serviço
│       ├── expoNotifications.client.ts  # Cliente expo-notifications
│       └── types.ts                 # Tipos TypeScript
└── screens/
    └── PushDebugScreen.tsx          # Tela de debug e testes
```

### Componentes Principais

#### 1. `NotificationService` (src/services/notifications/index.ts)

Serviço principal que expõe a API para o app.

**Métodos principais:**
- `requestPermissions()` - Solicita permissões
- `getPushToken()` - Obtém token do dispositivo
- `sendTestNotification()` - Simula notificação local
- `setHandlers()` - Define handlers customizados

#### 2. `ExpoNotificationsClient` (src/services/notifications/expoNotifications.client.ts)

Cliente de baixo nível para expo-notifications.

#### 3. `PushDebugScreen` (src/screens/PushDebugScreen.tsx)

Tela para testar e configurar notificações push.

**Funcionalidades:**
- Solicitar permissões
- Obter token
- Enviar teste local
- Ver status de permissões

---

## 💻 Uso Básico

### Exemplo 1: Solicitar Permissões

```typescript
import { notificationService } from './src/services/notifications';

// Solicitar permissões
const status = await notificationService.requestPermissions();

if (status === 'granted') {
  console.log('Permissão concedida!');
}
```

### Exemplo 2: Obter Token

```typescript
import { notificationService } from './src/services/notifications';

const token = await notificationService.getPushToken();

if (token) {
  console.log('Token:', token.data);
  // Envie este token para seu backend
}
```

### Exemplo 3: Configurar Handlers

```typescript
import { notificationService } from './src/services/notifications';
import { Notification } from 'expo-notifications';

// Handler para quando notificação é recebida
notificationService.setHandlers({
  onNotificationReceived: (notification: Notification) => {
    console.log('Nova notificação:', notification);
    
    // Processar dados da notificação
    const { title, body, data } = notification.request.content;
    
    // Navegar para tela específica
    if (data?.screen) {
      navigation.navigate(data.screen, data.params);
    }
  },
  
  onNotificationTapped: (notification: Notification) => {
    console.log('Usuário tocou na notificação');
    // Implementar navegação
  }
});
```

### Exemplo 4: Enviar Notificação de Teste Local

```typescript
import { notificationService } from './src/services/notifications';

// Envia notificação após 1 segundo
await notificationService.sendTestNotification(
  'Título da Notificação',
  'Corpo da notificação',
  { screen: 'Home', orderId: '123' },
  1 // delay em segundos
);
```

---

## 🚀 Exemplos de Backend

### Enviando Push via Expo Push Notification Service

#### Python (usando requests)

```python
import requests
import json

def send_push_notification(token, title, body, data=None):
    """Envia notificação push usando Expo Push API"""
    
    url = "https://exp.host/--/api/v2/push/send"
    
    payload = {
        "to": token,
        "title": title,
        "body": body,
        "data": data or {},
        "priority": "high",
        "sound": "default"
    }
    
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=payload)
    return response.json()

# Exemplo de uso
token = "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
result = send_push_notification(
    token,
    "Nova manutenção",
    "Moto ID 123 necessita manutenção",
    {"screen": "Manutencoes", "motoId": "123"}
)
```

#### Node.js

```javascript
const https = require('https');

async function sendPushNotification(token, title, body, data = {}) {
  const payload = JSON.stringify({
    to: token,
    title: title,
    body: body,
    data: data,
    priority: 'high',
    sound: 'default'
  });

  const options = {
    hostname: 'exp.host',
    path: '/--/api/v2/push/send',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// Exemplo de uso
const token = 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]';
sendPushNotification(
  token,
  'Alerta',
  'Nova manutenção agendada',
  { screen: 'Home', motoId: '123' }
).then(console.log);
```

#### .NET (C#)

```csharp
using System.Text;
using System.Text.Json;

public class PushNotificationService
{
    private readonly HttpClient _httpClient;
    private readonly string _expoUrl = "https://exp.host/--/api/v2/push/send";

    public PushNotificationService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task SendPushAsync(string token, string title, string body, object data = null)
    {
        var payload = new
        {
            to = token,
            title = title,
            body = body,
            data = data ?? new {},
            priority = "high",
            sound = "default"
        };

        var json = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(_expoUrl, content);
        return await response.Content.ReadAsStringAsync();
    }
}

// Exemplo de uso
var service = new PushNotificationService(httpClient);
await service.SendPushAsync(
    "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "Nova Manutenção",
    "Moto precisa de manutenção urgente",
    new { screen = "Manutencoes", motoId = "123" }
);
```

### Enviando Múltiplas Notificações

Para enviar para múltiplos dispositivos:

```javascript
const tokens = [
  'ExponentPushToken[xxxxx]',
  'ExponentPushToken[yyyyy]'
];

const payload = tokens.map(token => ({
  to: token,
  title: 'Notificação em massa',
  body: 'Enviada para todos os usuários',
  data: { type: 'broadcast' }
}));

// Enviar todas de uma vez
fetch('https://exp.host/--/api/v2/push/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify(payload)
});
```

### Estrutura de Dados Recomendada

```typescript
interface PushNotificationPayload {
  title: string;
  body: string;
  data?: {
    screen?: string;        // Tela para navegar
    params?: any;           // Parâmetros de navegação
    motoId?: string;        // ID de moto relacionada
    manutencaoId?: string;  // ID de manutenção
    filialId?: string;       // ID de filial
    type?: string;          // Tipo de notificação
  };
}

// Exemplo para manutenção
const payload = {
  title: 'Manutenção necessária',
  body: 'Moto LMX-1234 precisa de atenção',
  data: {
    screen: 'DetalhesMoto',
    params: { motoId: '123' },
    motoId: '123',
    type: 'maintenance'
  }
};
```

---

## 🧪 Testes

### 1. Acessar Tela de Debug

1. Abra o app
2. Vá para **Configurações** (aba inferior)
3. Toque em **🔔 Configurar Notificações Push**

### 2. Testar Permissões

1. Toque em **"Solicitar Permissões"**
2. Aceite a permissão
3. Status deve mudar para ✅ Concedida

### 3. Obter Token

1. Toque em **"Obter Token de Push"**
2. Copie o token exibido
3. Use para testes do backend

### 4. Testar Notificação Local

1. Toque em **"Enviar Notificação de Teste"**
2. Notificação aparecerá após 1 segundo
3. Teste tocar na notificação

### 5. Testar do Backend

Use curl para enviar notificação:

```bash
curl -X POST https://exp.host/--/api/v2/push/send \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "to": "ExponentPushToken[SEU_TOKEN_AQUI]",
    "title": "Teste do Backend",
    "body": "Notificação enviada com sucesso!",
    "data": {
      "screen": "Home",
      "motoId": "123"
    },
    "priority": "high",
    "sound": "default"
  }'
```

---

## 🔧 Solução de Problemas

### Erro: "Project ID não encontrado"

**Solução**: Configure o Project ID em `app.json`:

```json
"extra": {
  "eas": {
    "projectId": "seu-project-id-real"
  }
}
```

### Permissões não solicitadas no Android 13+

**Solução**: Verifique se `POST_NOTIFICATIONS` está no `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
```

### Token não funciona

**Causas comuns:**
- Project ID incorreto
- Token expirado (gere novo)
- App não possui permissões

**Solução**: Re-obtenha o token e verifique permissões.

### Notificações não aparecem

**Checklist:**
1. ✅ Permissões concedidas?
2. ✅ Token válido?
3. ✅ App aberto para testar foreground?
4. ✅ Backend enviando corretamente?

### Exibir notificações em foreground

Já configurado no `expoNotifications.client.ts`:

```typescript
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
```

---

## 📱 Deep Linking

### Navegação baseada em dados da notificação

```typescript
// No handler de notificação tocada
onNotificationTapped: (notification) => {
  const { screen, params } = notification.request.content.data;
  
  if (screen === 'DetalhesMoto') {
    navigation.navigate('MotosStack', {
      screen: 'DetalhesMoto',
      params: { moto: { id: params.motoId } }
    });
  }
}
```

### Suportados atualmente

- `screen: 'Home'` - Navega para Home
- `screen: 'ListaMotos'` - Abre lista de motos
- `screen: 'DetalhesMoto'` - Mostra detalhes (requer `motoId`)
- `screen: 'Manutencoes'` - Abre manutenções
- `screen: 'Filiais'` - Abre filiais

---

## 📊 Critérios de Aceite - ✅ Todos Implementados

- ✅ App pede permissão no iOS/Android e trata recusa
- ✅ App obtém e exibe token de push
- ✅ Recebe push em foreground e mostra UI in-app
- ✅ Recebe push em background/fechado e navega ao tocar
- ✅ Android tem NotificationChannel configurado
- ✅ Código organizado em `src/services/notifications/`
- ✅ Tipos TypeScript completos
- ✅ Provider opcional implementado
- ✅ Documentação completa
- ✅ Sem quebras no build
- ✅ Commits claros

---

## 🎉 Próximos Passos

1. **Configurar Project ID real** no `app.json`
2. **Implementar backend** para envio de notificações
3. **Adicionar tópicos** (ex: "manutencoes", "alertas")
4. **Implementar deep linking** completo
5. **Adicionar analytics** de notificações

---

## 📚 Referências

- [Expo Notifications Docs](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Expo Push Notification Service](https://docs.expo.dev/push-notifications/overview/)
- [EAS Project](https://expo.dev)

---

**Criado por**: Camargoogui  
**Data**: Dezembro 2024  
**Status**: ✅ Implementação Completa

