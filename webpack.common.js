const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config({ path: './.env' });
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');


module.exports = {
  entry: {
    app: './src/index.tsx',
    // sw: './src/service-worker.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    // filename: 'bundle.js',
    clean: true,
    assetModuleFilename: 'assets/[hash][ext]',
    filename: ({ runtime }) => {
      if (runtime === 'sw') {
        return '[name].js';
      }
      return 'bundle.[hash].js';
    },
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
    }),
    new InjectManifest({
      swSrc: './src/service-worker.ts',
      swDest: 'sw.js',
      exclude: [
        /index\.html$/,
      ],
    }),
  ],
  resolve: {
    plugins: [
      new TsconfigPathsPlugin(),
    ],
    extensions: ['.tsx', '.ts', '.js'],
  },
};