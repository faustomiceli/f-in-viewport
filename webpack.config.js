const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const config = {
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    filename: 'finviewport.js',
    path: path.resolve(__dirname, 'dist'),
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

  config.mode = argv.mode;

  return config;
};
