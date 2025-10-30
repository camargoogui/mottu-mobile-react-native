#!/usr/bin/env node

/**
 * Script para publicar builds no Firebase App Distribution
 * 
 * Uso manual:
 *   node scripts/publish-to-firebase-distribution.js <path-to-apk> [release-notes]
 * 
 * Uso via EAS Build:
 *   Este script pode ser executado manualmente após um build EAS.
 *   Para integração automática, use as variáveis de ambiente do EAS:
 *   - EAS_BUILD_ARTIFACTS_PATH: caminho do APK gerado
 *   - EAS_BUILD_GIT_COMMIT_HASH: hash do commit usado no build
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Tenta obter o caminho do APK das variáveis de ambiente do EAS ou dos argumentos
const APK_PATH = process.env.EAS_BUILD_ARTIFACTS_PATH || process.argv[2];
const RELEASE_NOTES = process.argv[3] || 
  process.env.EAS_BUILD_RELEASE_NOTES || 
  `Build automático via EAS\nCommit: ${process.env.EAS_BUILD_GIT_COMMIT_HASH || 'unknown'}`;

if (!APK_PATH) {
  console.error('❌ Erro: Caminho do APK não fornecido');
  console.error('Uso: node scripts/publish-to-firebase-distribution.js <path-to-apk> [release-notes]');
  console.error('Ou defina a variável de ambiente EAS_BUILD_ARTIFACTS_PATH');
  process.exit(1);
}

if (!fs.existsSync(APK_PATH)) {
  console.error(`❌ Erro: Arquivo APK não encontrado em: ${APK_PATH}`);
  process.exit(1);
}

// Configurações do Firebase App Distribution
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'mottu-challenge-mobile';
const FIREBASE_APP_ID = process.env.FIREBASE_APP_ID || '1:1047199101518:android:e7c15cce69d435ee1b891f';
const TESTER_GROUPS = process.env.FIREBASE_TESTER_GROUPS ? 
  process.env.FIREBASE_TESTER_GROUPS.split(',').map(g => g.trim()) : 
  ['testers'];

async function publishToFirebase() {
  try {
    console.log('🚀 Publicando build no Firebase App Distribution...');
    console.log(`📦 APK: ${APK_PATH}`);
    console.log(`📝 Release Notes: ${RELEASE_NOTES}`);
    console.log(`👥 Grupos de Testadores: ${TESTER_GROUPS.join(', ')}`);

    // Verifica se o Firebase CLI está instalado
    try {
      execSync('firebase --version', { stdio: 'ignore' });
    } catch (error) {
      console.error('❌ Firebase CLI não está instalado.');
      console.error('   Instale com: npm install --save-dev firebase-tools');
      console.error('   Ou use: npm install -g firebase-tools');
      process.exit(1);
    }

    // Verifica autenticação do Firebase
    try {
      execSync('firebase projects:list', { stdio: 'ignore' });
    } catch (error) {
      console.warn('⚠️  Não autenticado no Firebase. Execute: firebase login');
    }

    // Comando para publicar no Firebase App Distribution
    const firebaseCommand = [
      'firebase appdistribution:distribute',
      `"${APK_PATH}"`,
      `--app ${FIREBASE_APP_ID}`,
      `--groups "${TESTER_GROUPS.join(',')}"`,
      `--release-notes "${RELEASE_NOTES.replace(/"/g, '\\"')}"`,
      `--project ${FIREBASE_PROJECT_ID}`
    ].join(' ');

    console.log('📤 Executando comando Firebase...');
    execSync(firebaseCommand, { stdio: 'inherit' });

    console.log('✅ Build publicado com sucesso no Firebase App Distribution!');
  } catch (error) {
    console.error('❌ Erro ao publicar no Firebase App Distribution:', error.message);
    console.error('\n💡 Para integração automática com EAS Build:');
    console.error('   1. Configure as variáveis de ambiente: FIREBASE_APP_ID, FIREBASE_TESTER_GROUPS');
    console.error('   2. Execute este script após cada build:');
    console.error('      npm run build:android:preview');
    console.error('      node scripts/publish-to-firebase-distribution.js <caminho-do-apk>');
    process.exit(1);
  }
}

// Se executado diretamente, publica o build
if (require.main === module) {
  publishToFirebase();
}

module.exports = { publishToFirebase };

