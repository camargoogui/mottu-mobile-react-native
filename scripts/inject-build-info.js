#!/usr/bin/env node

/**
 * Script para injetar informações de build no app.json
 * Este script é executado antes do build para garantir que o hash do commit
 * esteja disponível no app
 */

const fs = require('fs');
const path = require('path');
const { getCommitHash, getCommitFullHash, getCommitDate, getBranchName } = require('./get-commit-hash');

const appJsonPath = path.join(__dirname, '..', 'app.json');

// Lê o app.json
let appJson;
try {
  appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
} catch (error) {
  console.error('Erro ao ler app.json:', error);
  process.exit(1);
}

// Obtém informações do build
const commitHash = getCommitHash();
const commitFullHash = getCommitFullHash();
const commitDate = getCommitDate();
const branchName = getBranchName();
const buildDate = new Date().toISOString();

// Injeta no app.json
if (!appJson.expo) {
  appJson.expo = {};
}
if (!appJson.expo.extra) {
  appJson.expo.extra = {};
}

appJson.expo.extra.buildInfo = {
  commitHash,
  commitFullHash,
  commitDate,
  branchName,
  buildDate,
};

// Salva o app.json atualizado
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2), 'utf8');

console.log('✅ Informações de build injetadas no app.json');
console.log(`   Commit Hash: ${commitHash}`);
console.log(`   Branch: ${branchName}`);

