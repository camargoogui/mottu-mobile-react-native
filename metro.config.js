// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Adiciona suporte para arquivos JSON de build-info
config.resolver.sourceExts.push('json');

// Garante que build-info.json seja incluído no bundle se existir
config.watchFolders = [
  path.resolve(__dirname),
];

module.exports = config; 