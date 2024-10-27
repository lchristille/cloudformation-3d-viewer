const path = require('path');
const dotenv = require('dotenv')

dotenv.config()

module.exports = {
    target: 'web', // Webview code runs in a browser environment
    mode: 'none',
  
    entry: './src/index.ts', // The entry point for the webview script
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
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
                        loader: 'babel-loader',
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env)
         })
    ],
    devtool: 'nosources-source-map',
};