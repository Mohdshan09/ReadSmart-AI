const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// expo-sqlite uses a WebAssembly binary for its web implementation.
// Metro does not include `.wasm` in its default asset extensions.
config.resolver.assetExts.push('wasm');

// lucide-react-native ships its icons as ESM `.mjs` files (e.g.
// ./icons/book-a.mjs). Metro does not resolve `.mjs` by default, so register
// it as a source extension or those icon imports fail to resolve.
config.resolver.sourceExts.push('mjs');

module.exports = config;
