const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  config.devServer = {
    ...(config.devServer || {}),
    host: '0.0.0.0',
    port: process.env.EXPO_WEB_PORT || 54949,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
  return config;
};
