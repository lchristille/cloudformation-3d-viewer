const path = require("path");
const webpack = require("webpack");

module.exports = {
  target: "web", // Webview code runs in a browser environment
  mode: "development",
  entry: "./src/index.tsx", // The entry point for the webview script
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
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
  devtool: "nosources-source-map",
};
