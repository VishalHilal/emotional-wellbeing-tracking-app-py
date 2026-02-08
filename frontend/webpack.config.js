const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Stub react-native-chart-kit for web to avoid requireNativeComponent errors
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-chart-kit': require.resolve('./web-stubs/chart-kit-stub.js'),
  };

  return config;
};

