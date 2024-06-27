// 取代CRA原本設定 //
// react ^17 CRA使用webpack5，不包含部分舊版node模組 //
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  webpack: {
    plugins: [
      new NodePolyfillPlugin(), //drag drop shpjs使用
    ],
  },
};