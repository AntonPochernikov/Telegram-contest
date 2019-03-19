const path = require('path');
const WebpackBar = require('webpackbar');
const webpack = require('webpack');

module.exports = {
  entry: [
    './src/index.js',
  ],
  output: {
    filename: 'main.js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'build/js'),
    publicPath: '/js/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          'babel-loader',
          'eslint-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css']
  },
  plugins: [
    new WebpackBar(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    noInfo: true,
    stats: 'minimal',
    port: 3000,
    contentBase: path.join(__dirname, 'public'),
    historyApiFallback: true,
    hot: true,
  }
};
