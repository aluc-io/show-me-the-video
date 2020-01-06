module.exports = {
  "env": {
    "development": {
      "presets": ["next/babel", "@zeit/next-typescript/babel"],
      "plugins": [
        ["babel-plugin-styled-components", { "minify": false }],
      ]
    },
    "production": {
      "presets": ["next/babel", "@zeit/next-typescript/babel"]
    },
    "test": {
      "presets": [
        "next/babel",
        "@zeit/next-typescript/babel",
      ],
      plugins: [
        "./__tests__/babel-plugin-rewire/babel-plugin-rewire.js",
      ]
    }
  }
}
