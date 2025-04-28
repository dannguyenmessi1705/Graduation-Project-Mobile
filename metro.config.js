// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Force commonjs for problematic modules
config.resolver.sourceExts = [...config.resolver.sourceExts, "cjs"];
config.resolver.assetExts = [...config.resolver.assetExts, "db"];

module.exports = config;
