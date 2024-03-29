const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
  entry: {
    main: ['react-hot-loader/patch', "./src/index.tsx"],
    sw: "./src/serviceWorker.ts",
  },
  target: "web",
  mode: "development",
  output: {
    // path: path.resolve(__dirname, "../backend/build"),
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
    publicPath: "/",
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          'react-hot-loader/webpack',
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
    runtimeChunk: 'single'
  },
  devtool: "eval",
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true,
    host: '0.0.0.0',
    port: process.env.PORT,
    hot: true,
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, "src", "index.html"),
    }),
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
});
