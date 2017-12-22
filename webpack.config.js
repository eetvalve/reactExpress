const path = require('path');
const merge = require('webpack-merge');
const parts = require('./webpack-loaders');
const webpack = require('webpack');

const PATHS = {
    src: path.join(__dirname, 'src'),
    dist: path.join(__dirname, 'dist'),
    css: path.join(__dirname, 'public/css')
};

const common = {
    entry: [
        // Add the client which connects to our middleware
        // You can use full urls like 'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr'
        // useful if you run your app from another point like django
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        // And then the actual application
        './src/index.js'
    ],
    output: {
        filename: 'bundle.js',
        publicPath: '/',
        path: path.resolve(__dirname, 'public')
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query:
                {
                    presets:['react', 'es2015']
                }
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};

let config;

switch(process.env.npm_lifecycle_event) {
    case 'server':
        config = merge(
            common,
            {
                devtool: 'source-map'
            },
            parts.setupCSS(PATHS.css)
        );
        break;
    default:
        config = merge(
            common,
            {
                devtool: 'eval-source-map'
            },
            parts.setupCSS(PATHS.css),
            parts.devServer({
                host: process.env.host,
                port: 3000
            })
        );
}

module.exports = config;

