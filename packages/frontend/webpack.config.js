const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  entry: {
    main: "./src/index.tsx",
    sw: "./src/serviceWorker.ts",
  },
  target: "web",
  mode: "production",
  output: {
    // path: path.resolve(__dirname, "../backend/build"),
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
      {
        test: /\.css$/,
        loader: "css-loader",
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: "file-loader",
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-react-loader",
            options: {
              jsx: true, // true outputs JSX tags
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
    ],
    removeAvailableModules: true,
    usedExports: true,
  },
  devtool: "source-map",
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true,
    host: '0.0.0.0',
    port: '8080',
    hot: true
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      minify: false,
      template: path.resolve(__dirname, "src", "index.html"),
    }),
    // new MiniCssExtractPlugin({
    //   filename: "./src/css/yourfile.css",
    // }),
    new CompressionPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: "public/manifest.json",
          to: path.resolve(__dirname, "build/manifest.json"),
        },
        {
          from: "public/favicon.ico",
          to: path.resolve(__dirname, "build/favicon.ico"),
        },
        {
          from: "public/img",
          to: path.resolve(__dirname, "build/img"),
        },
      ],
    }),
  ],
};
