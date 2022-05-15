const path = require('path');

module.exports = {
    entry: './src/client/index.js',
    mode: 'development',
    output: {
        clean: true,
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/assets'),
    },
    module: {
        rules: [
            {
                test: /\.less$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader",
                ],
            },
        ],
    },
};
