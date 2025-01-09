module.exports = {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', { moduleName: '@env' }], // For environment variables
      ['react-native-reanimated/plugin',{ loose: true }],
      ['@babel/plugin-transform-private-methods', { loose: true }]
    ],
  };