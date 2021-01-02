const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './functions/src/index.ts',
  output: {
    filename: 'index.js',
    path: `${__dirname}`,
    libraryTarget: 'this',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.test.ts'],
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(__dirname, 'tsconfig.json'),
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
  externals: [nodeExternals()],
};
