import { Platform } from 'react-native';
import { version as appVersion } from '../../package.json';
// @ts-ignore - app.json não tem tipos TypeScript
import appJson from '../../app.json';

// Try to import expo-constants if available
let Constants: any = null;
try {
  Constants = require('expo-constants').default;
} catch (e) {
  // expo-constants not available, will use fallback
}

/**
 * Informações de build do app
 * Capturadas durante o processo de build via EAS ou build local
 */
export interface BuildInfo {
  version: string;
  commitHash: string;
  commitFullHash?: string;
  commitDate?: string;
  branchName?: string;
  buildDate?: string;
  buildType?: 'development' | 'preview' | 'production';
  platform: string;
}

/**
 * Obtém informações de build do app
 * Tenta obter do app.json extras primeiro, depois do arquivo build-info.json
 */
export const getBuildInfo = (): BuildInfo => {
  // Tenta obter do app.json extras (configurado durante o build)
  const buildInfoFromExtras = appJson.expo?.extra?.buildInfo as any;

  // NOTA: As informações de build são injetadas no app.json via script inject-build-info.js
  // Não tentamos carregar build-info.json para evitar erros do Metro bundler
  // O Metro tenta resolver todos os requires em build time, mesmo dentro de condições

  // Tenta obter do expo-constants (se disponível)
  const expoConfig = Constants?.expoConfig;
  const expoExtras = expoConfig?.extra as any;
  const buildInfoFromConstants = expoExtras?.buildInfo;

  // Prioridade: Constants > app.json > defaults
  // As informações são injetadas no app.json via script, não precisamos do arquivo build-info.json
  const source = buildInfoFromConstants || buildInfoFromExtras || {};

  // Tenta obter commitHash de várias fontes
  const commitHash = 
    source.commitHash || 
    buildInfoFromExtras?.commitHash ||
    (buildInfoFromConstants as any)?.commitHash ||
    'development';

  const commitFullHash = 
    source.commitFullHash || 
    commitHash;

  const commitDate = 
    source.commitDate;

  const branchName = 
    source.branchName || 
    'unknown';

  const buildDate = 
    source.buildDate || 
    new Date().toISOString();

  // Determina o tipo de build baseado no ambiente
  let buildType: 'development' | 'preview' | 'production' = 'development';
  if (Constants?.executionEnvironment === 'standalone') {
    if (__DEV__) {
      buildType = 'development';
    } else {
      // Em build standalone, assume preview se não for dev
      buildType = 'preview';
    }
  } else if (!__DEV__) {
    buildType = 'preview';
  }

  return {
    version: appVersion || appJson.expo.version || '1.0.0',
    commitHash,
    commitFullHash,
    commitDate,
    branchName,
    buildDate,
    buildType,
    platform: Platform.OS,
  };
};

/**
 * Obtém uma string formatada com informações principais do build
 */
export const getBuildInfoString = (): string => {
  const info = getBuildInfo();
  return `v${info.version} (${info.commitHash.substring(0, 7)})`;
};

/**
 * Obtém o hash do commit atual
 */
export const getCommitHash = (): string => {
  return getBuildInfo().commitHash;
};

