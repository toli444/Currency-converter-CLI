module.exports = {
  name: 'server',
  entry: './app/currency-converter-server.js',
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  context: __dirname,
  output: {
    path: __dirname,
    filename: 'dist/server-compiled.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
        }],
      },
    ],
  },
};
