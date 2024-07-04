import * as path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: './src/app/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            'app': path.resolve(__dirname, 'src/app'),
            'entities': path.resolve(__dirname, 'src/entities'),
            'features': path.resolve(__dirname, 'src/features'),
            'shared': path.resolve(__dirname, 'src/shared'),
            'pages': path.resolve(__dirname, 'src/pages'),
            'widgets': path.resolve(__dirname, 'src/widgets'),
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 3000,
        historyApiFallback: true,
        open: true,
    },
};

export default config;