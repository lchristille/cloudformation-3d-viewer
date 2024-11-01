const path = require("path");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const isDevelopment = process.env.NODE_ENV !== 'production';
const webpack = require("webpack");

const nonce = process.env.NONCE || 'default-nonce';

module.exports = {
  target: "web", // Webview code runs in a browser environment
  mode: isDevelopment ? 'development' : 'production',
  entry: "./src/index.tsx", // The entry point for the webview script
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: 'http://localhost:9900/'
  },
  devtool: isDevelopment ? 'inline-source-map' : 'source-map',
  resolve: {
    extensions: [".ts", ".js", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
              presets: [
                "@babel/preset-env",
                ["@babel/preset-react", { runtime: "automatic" }],
                "@babel/preset-typescript",
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    isDevelopment && new ReactRefreshWebpackPlugin()
  ].filter(Boolean),
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist')
    },
    hot: true,
    headers: {
      "Content-Security-Policy": `script-src 'nonce-${nonce}`,
      "Access-Control-Allow-Origin": "*", // Allow all origins for development
    },
    host: 'localhost',
    client: {
      webSocketURL: 'ws://localhost:9900/ws'
    },
    port: 9900,
    allowedHosts: 'all'
  }
};
