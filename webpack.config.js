const path = require('path');

// Simple webpack configuration
module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externals: {
    'react': 'react',
    'react-dom': 'react-dom'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
};
