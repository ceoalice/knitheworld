const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebPackPlugin = require('copy-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(svg|png|wav|gif|jpg)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'static/assets/'
        }
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
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true
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
