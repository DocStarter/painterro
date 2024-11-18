"use strict";
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

function webpackConfig(target, mode) {
  let filename;
  if (target === "var") {
    filename = `painterro-${require("./package.json").version}.min.js`;
  } else if (target === "var-latest") {
    filename = "painterro.min.js";
    target = "var";
  } else {
    filename = `painterro.${target}.js`;
  }

  let options = {
    mode,
    entry: ["./js/main.js"],
    output: {
      path: path.resolve(__dirname, "build"),
      filename,
      libraryTarget: target,
    },
    plugins: [
      new ESLintPlugin({
        extensions: ["js"],
        exclude: ["/node_modules/"],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [{ loader: "style-loader" }, { loader: "css-loader" }],
        },
        {
          test: /\.(ttf|woff|woff2|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url-loader",
        },
      ],
    },
    stats: {
      colors: true,
    },
    devtool: "source-map",
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
  };
  if (target === "var") {
    options.output.library = "Painterro";
    options.output.libraryExport = "default";
    options.target = "browserslist";
    options.module.rules.push({
      test: /\.(?:js|mjs|cjs)$/,
      loader: "babel-loader",
      exclude: /node_modules/,
      options: {
        presets: [
          [
            "@babel/preset-env",
            { modules: "commonjs", useBuiltIns: "entry", corejs: "2" },
          ],
        ],
      },
    });
  }

  if (mode === "development") {
    options = {
      ...options,
      devServer: {
        static: path.join(__dirname, "build"),
        hot: true,
      },
      devtool: "inline-source-map",
    };
  } else {
    // options.plugins.push(new BundleAnalyzerPlugin());
  }

  return options;
}

const isDevServer = process.argv.find((v) => v.includes("serve"));

if (!isDevServer) {
  console.log("Building production");
  module.exports = [webpackConfig("var-latest", "production")];
} else {
  console.log("Building development");
  module.exports = [webpackConfig("var-latest", "development")];
}
