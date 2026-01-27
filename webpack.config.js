const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

let mode = "development";
if (process.env.NODE_ENV === "production") {
  mode = "production";
}

console.log(mode + " mode");

module.exports = {
  mode: mode,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
    filename: "[name].[fullhash].js",
  },
  devServer: {
    port: 5001,
    hot: true,
    static: "./dist",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-object-rest-spread"],
          },
        },
      },
      {
        test: /\.html$/i,
        use: ["html-loader"],
      },
      {
        test: /\.pug$/,
        loader: "@webdiscus/pug-loader",
      },
      {
        test: /\.(sass|scss|css)$/,
        use: [
          mode === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  "postcss-preset-env",
                  {
                    // options
                  },
                ],
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]",
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[fullhash][ext]",
        },
      },
    ],
  },
  stats: {
    children: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/dev/layout/index.pug",
      inject: "head", // Изменяем на 'head' для лучшего контроля
      scriptLoading: "defer", // Используем defer для лучшей производительности
      chunksSortMode: "manual", // Ручная сортировка чанков
      chunks: ["main"], // Указываем конкретные чанки
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
    new CleanWebpackPlugin(),
  ],
};
