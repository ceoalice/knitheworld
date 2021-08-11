const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebPackPlugin = require('copy-webpack-plugin');

const webpack = require('webpack');
require('dotenv').config();

const defaults = require('lodash').defaults;
const path = require('path');

const templateConfig = require('./public/template.config.js');
const routes = require('./routes.json');

let entry = {};

console.log({ENVIRONMENT : process.env.ANALYZE_BUNDLE});

module.exports = {
  output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
    publicPath: "/"
	},
  module: {
    rules: [
      {
        test: /\.(jpg|wav|gif|png)$/,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
          outputPath: 'static/assets/'
        }
      },

      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: [
          '@svgr/webpack', 
          {loader: 'file-loader',
          options: {
            outputPath: 'static/assets/'
          }}
        ],
      },
      
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: ['@babel/transform-runtime']
          }
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                  localIdentName: '[name]_[local]_[hash:base64:5]',
                  exportLocalsConvention: "camelCase"
              }
            }
          },
          'sass-loader'
        ]
      },
      
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            // options: {
            //   modules: true,
            //   localIdentName: '[name]_[local]_[hash:base64:5]',
            //   camelCase: true
            // }
            options: {
              modules: {
                  localIdentName: '[name]_[local]_[hash:base64:5]',
                  exportLocalsConvention: "camelCase"
              },
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      favicon: "./public/knitheworld-favicon.ico",
      filename: "./index.html"
    }),
    new CopyWebPackPlugin({
        patterns: [
            {
                from: 'node_modules/scratch-blocks/media',
                to: 'static/blocks-media'
            },
            { // files in static should be transfered 1:1 directly to new static in build
                from: 'static',
                to: "static"
            },
        ]
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env)
    }),
  ],
  optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'modules',
					chunks: 'all'
				}
			}
		}
	},
  devServer: {
    historyApiFallback: true
  }
};
