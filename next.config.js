module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: require.resolve('chess.js'),
      parser: {
        amd: false
      }
    });
    // Important: return the modified config
    return config
  },
}
