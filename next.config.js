const webpack = require('webpack')
const withTypescript = require('@zeit/next-typescript')
const withCss = require('@zeit/next-css')

let customConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) return config

    const { IgnorePlugin } = webpack
    config.plugins.push(new IgnorePlugin(/\.\/server$/))
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
    SMTV_CLONE_REPO_URL: process.env.SMTV_CLONE_REPO_URL,
  },
  publicRuntimeConfig: {
    SMTV_PUBLIC_REPO_URL: process.env.SMTV_PUBLIC_REPO_URL,
    SMTV_TITLE: process.env.SMTV_TITLE,
    SMTV_REPO_TYPE: process.env.SMTV_REPO_TYPE,
  },
}

customConfig = withTypescript(customConfig)
customConfig = withCss(customConfig)
module.exports = customConfig
