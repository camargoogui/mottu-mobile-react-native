#!/usr/bin/env node

/**
 * Script para capturar o hash do commit atual do Git
 * Este script é usado durante o build para injetar o hash do commit no app
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getCommitHash() {
  try {
    // Tenta obter o hash do commit atual (abreviado em 7 caracteres)
    const hash = execSync('git rev-parse --short=7 HEAD', { encoding: 'utf-8' }).trim();
    return hash;
  } catch (error) {
    console.warn('⚠️  Não foi possível obter o hash do commit do Git:', error.message);
    // Retorna um valor padrão se não conseguir obter o hash
    return 'unknown';
  }
}

function getCommitFullHash() {
  try {
    // Obtém o hash completo do commit
    const hash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
    return hash;
  } catch (error) {
    console.warn('⚠️  Não foi possível obter o hash completo do commit:', error.message);
    return 'unknown';
  }
}

function getCommitDate() {
  try {
    // Obtém a data do commit atual
    const date = execSync('git log -1 --format=%cd --date=iso', { encoding: 'utf-8' }).trim();
    return date;
  } catch (error) {
    console.warn('⚠️  Não foi possível obter a data do commit:', error.message);
    return new Date().toISOString();
  }
}

function getBranchName() {
  try {
    // Obtém o nome da branch atual
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    return branch;
  } catch (error) {
    console.warn('⚠️  Não foi possível obter o nome da branch:', error.message);
    return 'unknown';
  }
}

// Se executado diretamente, exporta as informações
if (require.main === module) {
  const commitHash = getCommitHash();
  const commitFullHash = getCommitFullHash();
  const commitDate = getCommitDate();
  const branchName = getBranchName();

  const buildInfo = {
    commitHash,
    commitFullHash,
    commitDate,
    branchName,
    buildDate: new Date().toISOString(),
  };

  // Exporta apenas o hash curto para uso como variável de ambiente
  console.log(commitHash);
  
  // Opcionalmente, salva as informações completas em um arquivo JSON
  const buildInfoPath = path.join(__dirname, '..', 'build-info.json');
  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
  console.error('📝 Informações de build salvas em:', buildInfoPath);
}

module.exports = {
  getCommitHash,
  getCommitFullHash,
  getCommitDate,
  getBranchName,
};

