const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


module.exports = {
    entry: './app/rng-challenge.js',
    output: {
        filename: 'bundle.js'
    },
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new UglifyJsPlugin({
            sourceMap: true,
            uglifyOptions: {
                output: {
                    comments: false, // remove comments
                },
                mangle: {
                    toplevel: true,
                    keep_fnames: false,
                    reserved: ['rand7Factory']
                },
                compress: {
                    unused: true,
                    keep_fnames: false,
                    dead_code: true,
                    warnings: false,
                    drop_debugger: true,
                    conditionals: true,
                    evaluate: true,
                    drop_console: false, // strips console statements
                    sequences: true,
                    booleans: true,
                }
            },
        }),
    ],
    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['env', {
                                "targets": {
                                    "browsers": ["last 2 versions", "ie >= 9"]
                                }
                            }]
                        ]
                    }
                }
            }

        ]
    }
}
