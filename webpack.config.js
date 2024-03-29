const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebPackPlugin = require('copy-webpack-plugin');

const webpack = require('webpack');
require('dotenv').config();

const defaults = require('lodash').defaults;
const path = require('path');

const templateConfig = require('./public/template.config.js');
const routes = require('./routes.json');

const entry = {};
const rewrites = [];
const htmlPlugins = [];

// using route info from ./routes.json to write 
// entry points, devServer rewrites, and html plugins
routes.forEach(route => {
  entry[route.name] =  [ "./src/init.js", route.view ];

  rewrites.push({ from : route.pattern , to : `/${route.filename}` });
  
  htmlPlugins.push(
    new HtmlWebPackPlugin(defaults({}, {
      filename: route.filename,
      chunks: [route.name],
      title : route.title,
      og_image : route.og_image
    }, templateConfig) )
  );
});

module.exports = (env, argv) => { 
// console.log({MODE : argv.mode});
// console.log({entry, rewrites, htmlPlugins})
return {
  entry : entry, 
  output: {
		filename: '[name].bundle.js', // 'js/[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
    publicPath: "/",
    chunkFilename: 'chunks/[name].js'
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
            options: {
              modules: {
                  localIdentName: '[name]_[local]_[hash:base64:5]',
                  exportLocalsConvention: "camelCase"
              },
            }
          }
        ]
      },
      // some libraries in node_modules REQUIRE that you don't use exclusively CSS-modules
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
        include: /node_modules/,
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
  // https://stackoverflow.com/questions/39798095/multiple-html-files-using-webpack/63385300
  plugins: [
    ...htmlPlugins,
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
  ].concat(argv.mode != 'production' && process.env.ANALYZE_BUNDLE === 'true' ? [
    new BundleAnalyzerPlugin()
  ] : []),

  // reduced splittng
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      
      // this would indivdually split every single npm package idk if this would be better

      // cacheGroups: {
      //   vendor: {
      //     test: /[\\/]node_modules[\\/]/,
      //     name(module) {
      //       // get the name. E.g. node_modules/packageName
      //       const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
      //       // npm package names are URL-safe, but some servers don't like @ symbols
      //       return `npm.${packageName.replace('@', '')}`;
      //     },
      //   },
      // },
    },
  },

  devServer: {
    historyApiFallback: {
      // Webpack dev server needs rewrites 
      // EXAMPLES: 
      // - localhost:8080/users/:id => localhost:8080/users.html
      // - localhost:8080/projects/:id => localhost:8080/projects.html
      // - localhost:8080/gui => localhost:8080/gui.html
      
      // Rewrites for firebase hosting are configured in ./firebase.json, 
      // and should be similar to patterns in ./routes.json
      rewrites: rewrites
    }
  }
}};
