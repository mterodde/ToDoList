const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './client/js/controller/mainController.js',
    mode: "development",
    output: {
        path: path.resolve(__dirname, 'server/public'),
        filename: 'app.bundle.js'
    },
    devServer: {
        publicPath: '/',
        inline: true,
        port: 8080
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-react']
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
};
