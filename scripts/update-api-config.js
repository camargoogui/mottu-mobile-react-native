const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Função para obter o IP local
function getLocalIP() {
  try {
    // Tenta usar o script get-ip.js
    const ip = execSync('node scripts/get-ip.js', { encoding: 'utf8' }).trim();
    return ip;
  } catch (error) {
    console.warn('Erro ao obter IP via script, usando fallback...');
    
    // Fallback manual
    const os = require('os');
    const interfaces = os.networkInterfaces();
    
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          if (name.includes('en0') || name.includes('Wi-Fi') || name.includes('Ethernet')) {
            return iface.address;
          }
        }
      }
    }
    
    return 'localhost';
  }
}

// Função para atualizar o arquivo de configuração da API
function updateApiConfig() {
  const ip = getLocalIP();
  const configPath = path.join(__dirname, '..', 'src', 'config', 'api.ts');
  
  try {
    let content = fs.readFileSync(configPath, 'utf8');
    
    // Substitui o IP na linha de retorno
    const ipRegex = /return '[^']+'; \/\/ Substitua pelo seu IP atual/;
    const newIP = `return '${ip}'; // Substitua pelo seu IP atual`;
    
    if (ipRegex.test(content)) {
      content = content.replace(ipRegex, newIP);
      fs.writeFileSync(configPath, content);
      console.log(`✅ API config atualizada com IP: ${ip}`);
      console.log(`🌐 URL da API: http://${ip}:5001/api`);
      console.log(`📁 Arquivo atualizado: src/config/api.ts`);
    } else {
      // Fallback: procura por qualquer IP na linha
      const fallbackRegex = /return '[0-9.]+';/;
      if (fallbackRegex.test(content)) {
        content = content.replace(fallbackRegex, `return '${ip}';`);
        fs.writeFileSync(configPath, content);
        console.log(`✅ API config atualizada com IP: ${ip}`);
        console.log(`🌐 URL da API: http://${ip}:5001/api`);
      } else {
        console.log('❌ Não foi possível encontrar o padrão do IP no arquivo');
        console.log('📝 Edite manualmente: src/config/api.ts');
      }
    }
  } catch (error) {
    console.error('❌ Erro ao atualizar configuração da API:', error.message);
  }
}

// Executa a atualização
updateApiConfig();
