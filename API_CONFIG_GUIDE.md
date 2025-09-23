# 🔧 Guia de Configuração da API

## 🚨 Problema Comum

O IP da sua máquina muda toda vez que você:
- Reinicia o roteador
- Reconecta na rede Wi-Fi  
- Muda de rede (casa/trabalho)

## ✅ Soluções Implementadas

### **1. Configuração Automática por Plataforma**

O app agora detecta automaticamente a plataforma e usa o IP correto:

- **📱 Emulador Android**: `10.0.2.2:5001` (automático)
- **🍎 iOS Simulator**: `localhost:5001` (automático)  
- **📱 Dispositivo Físico**: IP configurado em `src/config/api.ts`

### **2. Scripts Automáticos**

#### **Atualizar IP Automaticamente**
```bash
npm run update-api
```

#### **Ver IP Atual**
```bash
npm run get-ip
```

#### **Desenvolvimento (atualiza IP + inicia app)**
```bash
npm run dev
```

### **3. Configuração Manual**

Para dispositivos físicos, edite `src/config/api.ts`:

```typescript
// Linha 25 - substitua pelo seu IP atual
return '192.168.68.106'; // ← Seu IP aqui
```

## 🚀 Como Usar

### **Opção 1: Script Automático (Recomendado)**
```bash
# 1. Atualiza o IP automaticamente
npm run update-api

# 2. Inicia o app
npm start
```

### **Opção 2: Comando Único**
```bash
# Atualiza IP e inicia o app em um comando
npm run dev
```

### **Opção 3: Manual**
```bash
# 1. Descobre seu IP
npm run get-ip

# 2. Edita src/config/api.ts com o IP retornado
# 3. Inicia o app
npm start
```

## 🔍 Como Descobrir Seu IP

### **macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### **Windows:**
```cmd
ipconfig
```

### **Via Script:**
```bash
npm run get-ip
```

## 📱 Configuração por Plataforma

### **Emulador Android**
- ✅ **Automático**: Usa `10.0.2.2:5001`
- ✅ **Não precisa alterar nada**

### **iOS Simulator**  
- ✅ **Automático**: Usa `localhost:5001`
- ✅ **Não precisa alterar nada**

### **Dispositivo Físico**
- ⚠️ **Manual**: Precisa do IP real da sua máquina
- 🔄 **Atualizar**: Sempre que mudar de rede

## 🛠️ Configuração da API .NET

Para que funcione com dispositivos físicos, rode a API com:

```bash
dotnet run --urls "http://0.0.0.0:5001"
```

**Por quê `0.0.0.0`?**
- `localhost` só aceita conexões da própria máquina
- `0.0.0.0` aceita conexões de qualquer IP da rede
- Permite que dispositivos físicos se conectem

## 🎯 Resumo das Soluções

| Situação | Solução | Comando |
|----------|---------|---------|
| Emulador Android | Automático | `npm start` |
| iOS Simulator | Automático | `npm start` |
| Dispositivo Físico | Script | `npm run dev` |
| Mudança de rede | Script | `npm run update-api` |
| Verificar IP | Script | `npm run get-ip` |

## 🔧 Troubleshooting

### **"Network Error"**
1. Verifique se a API está rodando: `dotnet run --urls "http://0.0.0.0:5001"`
2. Atualize o IP: `npm run update-api`
3. Verifique o IP: `npm run get-ip`

### **"Connection Refused"**
1. Confirme que a API está na porta 5001
2. Teste no navegador: `http://SEU_IP:5001/api/Moto`
3. Verifique firewall/antivírus

### **IP Mudou**
1. Execute: `npm run update-api`
2. Ou edite manualmente: `src/config/api.ts`

---

**🎉 Agora você não precisa mais alterar o IP manualmente toda vez!**
