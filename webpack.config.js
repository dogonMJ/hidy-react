const path = require("path");
const webpack = require('webpack');
require('dotenv').config({ path: './.env' });
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
    assetModuleFilename: 'assets/[hash][ext]',
  },
  module: {
    //rules的值是一個陣列可以存放多個loader物件
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: { noEmit: false },
            }
          }
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource"
      },
      {
        test: /\.m?js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      favicon: "./public/favicon.ico",
      manifest: "./public/manifest.json",
      inject: true,
      minify: true,
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env)
    })
  ],
  resolve: {
    plugins: [
      new TsconfigPathsPlugin(),
    ],
    extensions: ['.tsx', '.ts', '.js'],
  },
};