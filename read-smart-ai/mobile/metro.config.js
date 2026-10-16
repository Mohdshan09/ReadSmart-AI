const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// expo-sqlite uses a WebAssembly binary for its web implementation.
// Metro does not include `.wasm` in its default asset extensions.
config.resolver.assetExts.push('wasm');

module.exports = config;
