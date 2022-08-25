const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { 
          presets: [
            "@babel/preset-typescript",
            "@babel/env"]
           }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx", ".tsx", ".ts"] },
  output: {
    path: path.resolve(__dirname, "dist/"),
    //publicPath: "/dist/",
    filename: "bundle.js"
  },
  devServer: {
    historyApiFallback: true,                   
  //   //contentBase: path.join(__dirname, "public/"),
  //   // port: 3000,
  //   // publicPath: "http://localhost:3000/dist/",
  //   hotOnly: true,
  },
  plugins: [
    //new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({template: "./public/index.html" }),
    new CleanWebpackPlugin(['./dist']),
    //new HtmlWebpackPlugin()
  ]
};
