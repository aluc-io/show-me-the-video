const webpack = require('webpack')
const withTypescript = require('@zeit/next-typescript')
const withCss = require('@zeit/next-css')

let customConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) return config

    const { IgnorePlugin } = webpack
    config.plugins.push(new IgnorePlugin(/\.\/server$/))
    config.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.SMTV_VERSION': JSON.stringify(process.env.SMTV_VERSION || 'local'),
    }))

    config.watchOptions = {
      ignored: [
        /\.git\//,
        /src\/\.next\//,
        /node_modules/
      ]
    }
    return config
  },
  serverRuntimeConfig: {
    isServer: true,
  },
}

customConfig = withTypescript(customConfig)
customConfig = withCss(customConfig)
module.exports = customConfig
