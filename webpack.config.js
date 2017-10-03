/**
 * Created by arey on 4/28/17.
 */
const { isDevelopment, getEnvironment } = require('./helpers/environmentHelper');
const config = require('config');
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CleanCSSPlugin = require('less-plugin-clean-css');
const ManifestPlugin = require('webpack-manifest-plugin');

const port = config.get('app.port');
const isAdaptive = config.get('adaptive');
const baseDirectory = __dirname;
const pagesDirectory = path.join(baseDirectory, 'app', 'pages');

// List of extract text plugins
const extractTextPlugins = [];

// Creating extract text plugins for CSS on specific devices
if (isAdaptive) {
  extractTextPlugins.push(new ExtractTextPlugin({
    filename: getCssOutputName('css', 'desktop'),
  }));

  extractTextPlugins.push(new ExtractTextPlugin({
    filename: getCssOutputName('css', 'mobile'),
  }));
} else {
  extractTextPlugins.push(new ExtractTextPlugin({
    filename: getOuputName('css'),
  }));
}

module.exports = {
  entry: Object.assign({}, pageEntryPoint({
    index: [
      path.join(baseDirectory, '/app/client/index.js'),
    ],
    adaptive: [
      path.join(baseDirectory, '/app/client/adaptive.js'),
    ]
  }), {
    vendor: [
      'react', 'react-dom', 'react-declarative-head'
    ]
  }),
  // the bundle file we will get in the result
  output: {
    publicPath: 'http://localhost:' + port + '/',
    path: path.join(baseDirectory, 'bundles'),
    filename: getOuputName('js'),
  },
  module: {
    loaders: getLoaders(),
  },
  plugins: pluginsToLoad(),
  target: 'web'
};

function getLoaders() {
  const loaders = [];

  // Adding babel common loader
  loaders.push({
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
  });

  // If it is adaptive get the loaders for desktop and mobile style loaders
  if (isAdaptive) {
    loaders.push(getStyleLoader('desktop'));
    loaders.push(getStyleLoader('mobile'));
  } else {
    loaders.push(getStyleLoader());
  }

  return loaders;
}

/**
 * Add modules to entry point only when its development
 * @param entry
 * @returns {*}
 */
function pageEntryPoint(entry) {
  const devEntries = ['react-hot-loader/patch', 'webpack-hot-middleware/client'];

  if (typeof entry !== 'object') {
    // Convert to array if is not an array
    entry = Array.isArray(entry) ? entry : [entry];

    // If it is development add the dev entries only used on development environments
    return {
      main: (isDevelopment()) ? devEntries.concat(entry) : entry
    };
  } else if (typeof entry === 'object') {
    Object.keys(entry).forEach((pageName) => {
      // Get styles entries
      const stylesEntries = getStyles(pageName);

      // Convert to array if is not an array
      entry[pageName] = Array.isArray(entry[pageName]) ? entry[pageName] : [entry[pageName]];

      if (isDevelopment()) {
        entry[pageName] = devEntries.concat(entry[pageName]);
      }

      // If the page have styles add them to the entry point list
      if (stylesEntries.length > 0) {
        entry[pageName] = entry[pageName].concat(stylesEntries);
      }
    });
    return entry;
  } else {
    throw new Error(`Expected entry point to be object, array or string. Instead got: ${entry}`);
  }
}

/**
 * Get styles depending on if it is adaptive or not
 * @param pageId
 * @returns {Array}
 */
function getStyles(pageId) {
  const stylesEntries = [];
  const pageDirectory = path.join(pagesDirectory, pageId);

  if (isAdaptive) {
    const desktopPath = path.join(pageDirectory, 'styles', 'index.desktop.less');
    const mobilePath = path.join(pageDirectory, 'styles', 'index.mobile.less');

    if (fs.existsSync(desktopPath) && fs.existsSync(mobilePath)) {
      stylesEntries.push(desktopPath, mobilePath);
    } else {
      console.log('You have adaptive configuration enable, you must add a index.desktop.less and index.mobile.less on your page directory. This is just a warning, no css were build');
    }
  } else {
    const stylePath = path.join(pageDirectory, 'styles', 'index.less');

    if (fs.existsSync(stylePath)) {
      stylesEntries.push(stylePath);
    } else {
      console.log('You dont have any styles file. Remember to add index.less on your page directory');
    }
  }

  return stylesEntries;
}

/**
 * Get styles loaders depending on if it is adaptive or not
 * @param device
 * @returns {{test: RegExp, use: Array.<string>}}
 */
function getStyleLoader(device) {
  let lessLoaderPlugins = [];
  let extractPlugin;

  if (!isDevelopment()) {
    lessLoaderPlugins.push(
      new CleanCSSPlugin({
        advanced: true,
        minify: true
      })
    )
  }

  // If a device is sent add the extract plugin for the specific device
  if (device) {
    // Fint the correct extract text depending on the device
    const pattern = new RegExp(`\.${device}\.`);
    extractPlugin = extractTextPlugins.filter(extract => pattern.test(extract.filename))[0];
    // Generate the device pattern for the extract text plugin
    const loaderPattern = new RegExp(`${device}\.less$`);

    return {
      test: loaderPattern,
      use: ['css-hot-loader'].concat(
        extractPlugin.extract({
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
    };
  }

  const pattern = new RegExp(`\.less$`);
  extractPlugin = extractTextPlugins.filter(extract => pattern.test(extract.filename))[0];

  return {
    test: /\.less$/,
    use: ['css-hot-loader'].concat(
      extractPlugin.extract({
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
  };
}

/**
 * Get the plugins to load
 * @returns {[*,*]}
 */
function pluginsToLoad() {
  let plugins = [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(getEnvironment())
      }
    })
  ];

  // Add all the extract text plugins
  plugins = plugins.concat(extractTextPlugins);

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
      new ManifestPlugin({
        map: (el) => {
          // If it is CSS and adaptive mode is enable. Rename the chuck name to generate two different files on manifest
          if (isAdaptive && /\.css$/.test(el.path)) {
            const isMobile = /\.(mobile)\./.test(el.path);
            const isDesktop = /\.(desktop)\./.test(el.path);
            // Change the chunk name to generate a different entry on manifest
            el.name = `${el.chunk.name}.${isDesktop ? 'desktop' : isMobile ? 'mobile' : ''}.css`;
          }

          return el;
        }
      }),
    ]);
  }

  return plugins;
}

function getOuputName(extension) {
  return `[name]${!isDevelopment() ? '.[hash]' : ''}.${extension}`;
}

function getCssOutputName(extension, device) {
  return `[name].${device}${!isDevelopment() ? '.[hash]' : ''}.${extension}`;
}