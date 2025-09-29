// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind', reanimated: false }], // 👈 bloqueia a injeção do plugin antigo
      'nativewind/babel',
    ],
    plugins: [
      ['module-resolver', {
        root: ['./'],
        alias: { '@': './', 'tailwind.config': './tailwind.config.js' },
      }],
      // 👇 mantenha como o ÚLTIMO plugin
      'react-native-worklets/plugin',
    ],
  };
};
