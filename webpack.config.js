const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

const glob = require('glob');

// webpack parts file
const parts = require('./webpack.parts');

// commonly used path variables
const PATHS = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build'),
};

// configuration shared by production and development
const commonConfig = merge([
  {
    output: {
      path: PATHS.build,
      filename: '[name].js',
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
      }),
    ],
  },
  parts.loadFonts({
    options: {
      name: '[name].[hash:8].[ext]',
    },
  }),
  parts.loadJavaScript({ include: PATHS.app }),  
]);

const productionConfig = merge([
  {
    entry: {
      vendor: ['react'],
    },
    // warn user when the build size is too big
    performance: {
      hints: 'warning', // 'error' or false are valid too
      maxEntrypointSize: 100000, // in bytes
      maxAssetSize: 450000, // in bytes
    },
    output: {
      chunkFilename: '[name].[chunkhash:8].js',
      filename: '[name].[chunkhash:8].js',
      // matches GitHub project name
      // publicPath: '/webpack-boilerplate/',
    },
    plugins: [
      new webpack.HashedModuleIdsPlugin(),
    ],
    recordsPath: path.join(__dirname, 'records.json'),
  },
  // for bundle splitting, automatically searches through node_modules
  parts.extractBundles([
    {
      name: 'vendor',
      minChunks: ({ resource }) => (
        resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.js$/)
      ),
    },
    {
      name: 'manifest',
      minChunks: Infinity,
    },
  ]),
  parts.clean(PATHS.build),
  parts.minifyJavaScript(),
  parts.setFreeVariable(
    'process.env.NODE_ENV',
    'production'
  ),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true,
      },
      // Run cssnano in safe mode to avoid unsafe transformations.
      safe: true,
    },
  }),
  parts.generateSourceMaps({ type: 'source-map' }),  
  parts.extractCSS({
    use: ['css-loader', parts.autoprefix(), 'sass-loader'],
  }),
  // needs to run AFTER extract text plugin
  parts.purifyCSS({
    paths: glob.sync(`${PATHS.src}/**/*.js`, { nodir: true }),
  }),
  // load images
  parts.loadImages({
    options: {
      limit: 15000, // uses file-loader if over
      name: '[name].[hash:8].[ext]',
    },
  }),
]);

const developmentConfig = merge([
  {
    output: {
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
    },
  },
  parts.generateSourceMaps({ type: 'cheap-module-eval-source-map' }),
  parts.devServer({
    // customize host/port here if necessary
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
  parts.loadImages(),  
]);

module.exports = (env) => {
  const pages = [
    parts.page({
      title: 'Main',
      entry: {
        main: PATHS.src,
      },
      chunks: ['main', 'manifest', 'vendor'],
    }),
    parts.page({
      title: 'another',
      path: 'another',
      entry: {
        another: path.join(PATHS.src, 'another.js'),
      },
      chunks: ['another', 'manifest', 'vendor'],
    }),
  ];

  const config = (env === 'production') ?
    productionConfig : developmentConfig;

  return merge([commonConfig, config].concat(pages));
};