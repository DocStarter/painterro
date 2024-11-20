import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __isDevServer = process.argv.find((v) => v.includes("serve"));
const __isModule = process.argv.find((v) => v.includes("--env=module"));
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const config = {
  // Entry point of your module
  entry: "./js/main.js", // Your entry module

  // Output configuration
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "painterro.js", // The name of the bundled file
    library: {
      name: "painterro",
      type: "umd",
      umdNamedDefine: true,
    },
    clean: true, // Clean up previous builds
    // module: true, // Ensure that output is treated as a module
  },

  // Module rules (Babel loader for transpiling ES6+ code)
  module: {
    rules: [
      {
        test: /\.js$/, // Process JavaScript files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Use Babel to transpile modern JS
          options: {
            presets: ["@babel/preset-env"], // Preset for modern JavaScript
            plugins: ["@babel/plugin-syntax-import-assertions"], // Support for import assertions if needed
          },
        },
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
      {
        test: /\.(ttf|woff|woff2|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        type: "asset/resource",
        generator: {
          filename: "./assets/[hash][ext]",
        },
      },
    ],
  },

  // Target the browser environment
  target: "web", // Set target to web for browser compatibility

  // Source maps for easier debugging (optional)
  devtool: "source-map",

  // Mode (production mode is recommended for final builds)
  mode: __isDevServer ? "development" : "production",
};

if (__isDevServer) {
  config.devServer = {
    static: path.join(__dirname, "build"), // Serve files from the dist folder
    compress: true, // Enable gzip compression
    port: 9000, // The port for the dev-server
    open: true, // Open the browser automatically
    hot: true, // Enable Hot Module Replacement (HMR)
    watchFiles: ["src/**/*"], // Watch files in the `src/` directory
  };

  config.plugins = [
    new HtmlWebpackPlugin({
      template: "./html/index.html", // The template for generating index.html
    }),
  ];
}

if (__isModule) {
  console.log("Building module...");
  config.output.library = {
    type: "module",
  };
  config.output.module = true;
  config.experiments = { outputModule: true };
}

export default config;
