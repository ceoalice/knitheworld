const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebPackPlugin = require('copy-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

// postcss
const postCSSConfig = require('./postcss.config');
const autoprefixer = require('autoprefixer');

const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpg|wav|gif|png)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'static/assets/'
        }
      },

      {
        test: /\.png$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },

      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: ['@svgr/webpack', 'file-loader'],
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
      
      // https://github.com/postcss/postcss#usage
      // https://github.com/DavidWells/PostCSS-tutorial
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2,
              localIdentName: '[name]_[local]_[hash:base64:5]',
              camelCase: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                plugins: function () {
                    return [autoprefixer({browsers: ['last 3 versions', 'Safari >= 8', 'iOS >= 8']})];;
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
          // {
          //   loader: 'style-loader',
          //   options: { injectType: 'singletonStyleTag' },
          // },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]_[local]_[hash:base64:5]',
              camelCase: true
            }
            // options: {
            //   importLoaders: 1,
            //   // modules: {
            //   //     localIdentName: '[name]_[local]_[hash:base64:5]',
            //   //     exportLocalsConvention: "camelCase"
            //   // },
            // }
          },
          {
            loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                plugins: function () {
                    return postCSSConfig;
                }
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
      },
      {
        test: /\.xml$/i,
        use: 'raw-loader',
      },
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html"
    }),
    new CopyWebPackPlugin({
        patterns: [
            {
                from: 'node_modules/scratch-blocks/media',
                to: 'static/blocks-media'
            }
        ]
    }),
    new WebpackPwaManifest({
        name: 'PixelPlay',
        short_name: 'pixelplay',
        description: 'Scratch Neopixel Microworld',
        background_color: '#a29bfe',
        theme_color: '#a29bfe',
        orientation: 'portrait',
        display: 'standalone',
        inject: true,
        ios: true,
        icons: [
          {
            src: path.resolve('static/icon-512.png'),
            sizes: [96, 128, 192, 256, 384, 512]
          },
          {
            src: path.resolve('static/icon-1024.png'),
            sizes: '1024x1024'
          },
          {
            src: path.resolve('static/icon-apple.png'),
            sizes: [120, 152, 167, 180, 192],
            destination: path.join('icons', 'ios'),
            ios: true
          },
          {
            src: path.resolve('static/icon-1024.png'),
            sizes: '1024x1024',
            purpose: 'maskable'
          }
        ]
    })
  ]
};
