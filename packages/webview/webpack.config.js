const path = require('path');

module.exports = {
    target: 'web', // Webview code runs in a browser environment
    mode: 'none',
  
    entry: './src/webview.ts', // The entry point for the webview script
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
                          configFile: 'tsconfig.json'
                        }
                    }
                ]
            }
        ]
    },
    devtool: 'nosources-source-map',
};