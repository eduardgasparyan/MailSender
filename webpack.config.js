const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
module.exports = {
    resolve: {
        mainFields: ['main', 'module'],
    },
    mode: 'none',
    entry: slsw.lib.entries,
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    target: 'node', // important in order not to bundle built-in modules like path, fs, etc.
    externals: [nodeExternals({
        // this WILL include `jquery` and `webpack/hot/dev-server` in the bundle, as well as `lodash/*`
        allowlist: ['jquery', 'webpack/hot/dev-server', /^lodash/]
    })],
};