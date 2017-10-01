/**
 * Created by arey on 4/28/17.
 */
const { isDevelopment, getEnvironment } = require('./helpers/environmentHelper');
const config = require('config');
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CleanCSSPlugin = require('less-plugin-clean-css');
const ManifestPlugin = require('webpack-manifest-plugin');

const port = config.get('app.port');
const baseDirectory = __dirname;

const extractLess = new ExtractTextPlugin({
  filename: getOuputName('css')
});

module.exports = {
  entry: entryPoint({
    index: [
      path.join(baseDirectory, '/app/client/index.js'),
      path.join(baseDirectory, '/app/pages/index/index.less')
    ]
  }),
  // the bundle file we will get in the result
  output: {
    publicPath: 'http://localhost:' + port + '/',
    path: path.join(baseDirectory, 'bundles'),
    //path: '/',
    filename: getOuputName('js'),
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.js?$/,
        include: path.join(baseDirectory, '/app'),
        query: {
          env: {
            development: {
              presets: ['react-hmre'],
              plugins: [
                [
                  'react-transform', {
                  transforms: [
                    {
                      transform: 'react-transform-hmr',
                      imports: ['react'],
                      locals: ['module']
                    }
                  ]
                }
                ]
              ]
            }
          },
        }
      },
      styleLoader(),
    ],
  },
  plugins: pluginsToLoad(),
  target: 'web'
};

/**
 * Add modules to entry point only when its development
 * @param entry
 * @returns {*}
 */
function entryPoint(entry) {
  const devEntries = ['react-hot-loader/patch', 'webpack-hot-middleware/client'];

  if (Array.isArray(entry)) {
    return {
      main: (isDevelopment()) ? devEntries.concat(entry) : entry
    }
  } else if (typeof entry === 'string') {
    return {
      main: (isDevelopment()) ? devEntries.concat([entry]) : [entry]
    }
  } else if (typeof entry === 'object') {
    Object.keys(entry).forEach((entryName) => {
      if (!Array.isArray(entry[entryName])) {
        entry[entryName] = (isDevelopment()) ? devEntries.concat([entry[entryName]]) : [entry[entryName]]
      } else {
        entry[entryName] = (isDevelopment()) ? devEntries.concat(entry[entryName]) : entry[entryName]
      }
    });
    return entry;
  } else {
    throw new Error(`Expected entry point to be object, array or string. Instead got: ${entry}`);
  }
}

function styleLoader() {
  let lessLoaderPlugins = [];

  if (!isDevelopment()) {
    lessLoaderPlugins.push(
      new CleanCSSPlugin({
        advanced: true,
        minify: true
      })
    )
  }

  return {
    test: /\.(css|less)$/,
    use: ['css-hot-loader'].concat(
      extractLess.extract({
        use: [{
          loader: 'css-loader'
        }, {
          loader: 'autoprefixer-loader'
        }, {
          loader: 'less-loader',
          options: {
            plugins: lessLoaderPlugins
          },
        }],
        fallback: 'style-loader'
      })
    )
  }
}

function pluginsToLoad() {
  let plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(getEnvironment())
      }
    })
  ];

  // Always extract the CSS
  plugins.push(extractLess);

  if (isDevelopment()) {
    plugins = plugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ]);
  } else {
    // This must be the first plugin
    plugins.unshift(
      new CleanWebpackPlugin([path.join(baseDirectory, 'bundles')], {
        verbose: true,
        allowExternal: true
      })
    );

    plugins = plugins.concat([
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        output: {
          comments: false
        },
        screwIe8: true,
        sourceMap: false
      }),
      new ManifestPlugin()
    ]);
  }

  return plugins;
}

function getOuputName(extension) {
  return isDevelopment() ? ('[name].' + extension) : ('[name].[hash].' + extension);
}