const path = require('path');
const ClosurePlugin = require('closure-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const config = {
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    filename: 'vinvieport.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [],
  },
  plugins: [new CleanWebpackPlugin()],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  if (argv.mode === 'production') {
    config.optimization = {
      minimizer: [new ClosurePlugin({mode: 'STANDARD'}, {})],
    };
  }

  config.mode = argv.mode;

  return config;
};
