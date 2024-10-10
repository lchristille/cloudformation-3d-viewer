//@ts-check

'use strict';

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
  target: 'node', // VS Code extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
	mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')

  entry: './src/extension/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    // modules added here also need to be added in the .vscodeignore file
  },
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  devtool: 'nosources-source-map',
  infrastructureLogging: {
    level: "log", // enables logging required for problem matchers
  },
};

/** @type WebpackConfig */
const webviewConfig = {
  target: 'web', // Webview code runs in a browser environment
  mode: 'none',

  entry: './src/viewer/webview.ts', // The entry point for the webview script
  output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'webview.js',
  },
  resolve: {
      extensions: ['.ts', '.js']
  },
  module: {
      rules: [
          {
              test: /\.ts$/,
              exclude: /node_modules/,
              use: [
                  {
                      loader: 'ts-loader',
                      options: {
                        configFile: 'tsconfig.webview.json'
                      }
                  }
              ]
          }
      ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'media'), // Copy all files from 'media' directory
          to: path.resolve(__dirname, 'dist/public') // Output them in the 'dist/webview/media' directory
        }
      ]
    })
  ],
  devtool: 'nosources-source-map',
};

module.exports = [ extensionConfig, webviewConfig ];