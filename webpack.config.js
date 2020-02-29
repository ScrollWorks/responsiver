const LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
    entry: './index.js',
    output: {
        path: __dirname,
        publicPath: './example',
        filename: './example/bundle.js'
    },
    plugins: [
        new LiveReloadPlugin({appendScriptTag: true})
    ]
};
