/* eslint-disable */
const LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
    entry: './index',
    output: {
        path: __dirname,
        publicPath: './',
        filename: './bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts']
    },
    plugins: [
        new LiveReloadPlugin({appendScriptTag: true})
    ]
};
