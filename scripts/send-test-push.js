/**
 * Script para enviar notificação push de teste
 * 
 * Uso:
 *   node scripts/send-test-push.js <TOKEN> <TÍTULO> <CORPO>
 * 
 * Exemplo:
 *   node scripts/send-test-push.js ExponentPushToken[xxxxx] "Teste" "Mensagem de teste"
 */

const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para enviar notificação
function sendPushNotification(token, title, body, data = {}) {
  return new Promise((resolve, reject) => {
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

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          resolve(result);
        } catch (error) {
          reject(new Error(`Erro ao parsear resposta: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

// Função principal
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('\n📱 Script de Envio de Notificação Push\n');
    console.log('Uso:');
    console.log('  node scripts/send-test-push.js <TOKEN> <TÍTULO> <CORPO> [SCREEN] [PARAMS]\n');
    console.log('Exemplo:');
    console.log('  node scripts/send-test-push.js ExponentPushToken[xxxx] "Alerta" "Mensagem" Home "{}"\n');
    
    process.exit(1);
  }

  const [token, title, body, screen, paramsJson] = args;

  if (!token || !title || !body) {
    console.error('❌ Erro: Token, título e corpo são obrigatórios');
    console.log('\nUso: node scripts/send-test-push.js <TOKEN> <TÍTULO> <CORPO> [SCREEN] [PARAMS]');
    process.exit(1);
  }

  // Parse params
  let data = {};
  if (screen) {
    data.screen = screen;
  }
  if (paramsJson) {
    try {
      data.params = JSON.parse(paramsJson);
    } catch (error) {
      console.error('❌ Erro ao parsear params:', error.message);
      process.exit(1);
    }
  }

  console.log('\n🔔 Enviando notificação push...\n');
  console.log('Token:', token.substring(0, 50) + '...');
  console.log('Título:', title);
  console.log('Corpo:', body);
  if (data.screen) {
    console.log('Screen:', data.screen);
  }
  console.log('');

  try {
    const result = await sendPushNotification(token, title, body, data);
    
    console.log('✅ Notificação enviada com sucesso!\n');
    console.log('Resposta:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Erro ao enviar notificação:', error.message);
    process.exit(1);
  }
}

main();

