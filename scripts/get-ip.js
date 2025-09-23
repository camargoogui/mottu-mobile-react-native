const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Pula interfaces internas e não IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        // Prioriza interfaces Wi-Fi e Ethernet
        if (name.includes('en0') || name.includes('Wi-Fi') || name.includes('Ethernet')) {
          return iface.address;
        }
      }
    }
  }
  
  // Fallback: retorna o primeiro IP válido
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return 'localhost';
}

const ip = getLocalIP();
console.log(ip);
