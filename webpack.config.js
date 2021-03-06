const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const WorkboxPlugin = require('workbox-webpack-plugin');
const path = require("path");
module.exports = (env, argv) => {
  return {
    resolve: {
      alias: {
        modernizr$: path.resolve(__dirname, "./.modernizrrc.js"),
        jquery$: path.resolve(__dirname, "./node_modules/jquery"),
        media: path.resolve(__dirname, "./src/media"),
        core: path.resolve(__dirname, "./src/JS/core"),
        blocks: path.resolve(__dirname, "./src/JS/blocks"),
        blocklyMods: path.resolve(__dirname, "./src/JS/blocklyMods"),
        thirdParty: path.resolve(__dirname, "./src/JS/thirdParty"),
        translations: path.resolve(__dirname, "./src/JS/translations"),
        generator: path.resolve(__dirname, "./src/JS/generator")
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
      }), new HtmlWebpackPlugin({
        title: 'NS Editor',
        template: 'src/index.html'
      }), new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true
      }),
    ],
    entry: ["core-js/stable", "regenerator-runtime/runtime", "./src/app.js"],
    target: "web",
    output: {
      filename: "bundle.min.js"
    },
    optimization: {
      minimizer: [new TerserPlugin()]
    },
    module: {
      rules: [{
          test: /\.js$/,
          loader: "babel-loader",
          options: {
            plugins: ["@babel/plugin-proposal-class-properties"],
            compact: false
          }
        },
        {
          test: /cld-min\.js/,
          loader: "script-loader"
        },
        {
          loader: "webpack-modernizr-loader",
          test: /\.modernizrrc\.js$/
        },
        {
          test: [
            path.resolve(__dirname, "./node_modules/firebaseui/dist/npm.js")
          ],
          loader: "string-replace-loader",
          options: {
            search: `var l=this`,
            replace: `var l=window`,
            strict: true
          }
        },
        {
          test: /datedropper\.js$/,
          loader: "string-replace-loader",
          options: {
            search: `$(this).is('input')`,
            replace: `($(this).is('paper-input')||$(this).is('input'))`,
            strict: true
          }
        },
        {
          test: /\.(css)$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.(jpg|png|svg|mp4|m4a|woff|woff2|eot|ttf|wav)$/,
          loader: "url-loader"
        }
      ]
    }
  };
};