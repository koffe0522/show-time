import * as path from 'path';
import * as nodeExternals from 'webpack-node-externals';
import * as webpack from 'webpack';

const resolveOptions: webpack.ResolveOptions = {
  extensions: ['.ts', '.js', '.json', '.test.ts'],
  alias: {
    '@': path.resolve(__dirname, './functions'),
  },
};

const moduleOptions: webpack.ModuleOptions = {
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
};

const plugins: webpack.EnvironmentPlugin[] = [
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'production',
  }),
];

const config: webpack.Configuration = {
  target: 'node',
  mode: 'production',
  entry: './functions/index.ts',
  output: {
    filename: 'index.js',
    path: `${__dirname}`,
    libraryTarget: 'this',
  },
  resolve: resolveOptions,
  module: moduleOptions,
  plugins: plugins,
  externals: [nodeExternals() as any],
};

export default config;
