const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const babel = require('@webpack-blocks/babel6');
const sass = require('@webpack-blocks/sass');
const extractText = require('@webpack-blocks/extract-text2');
const devServer = require('@webpack-blocks/dev-server2');
const {
  addPlugins,
  createConfig,
  defineConstants,
  env,
  entryPoint,
  setOutput,
  sourceMaps
} = require('@webpack-blocks/webpack2');

// This probably shouldn't be committed to version control. We
// should use dotenv to load this config from an environment file.
const MAPBOX_TOKEN = 'pk.eyJ1Ijoianp3ZWliZWwiLCJhIjoiY2owcGt2cjFmMDBzejMzbXIxN3g2M3ZydSJ9.cGaL9WA2Zbdt1ahVcfqvAw';

const addLoader = (loaderConfig) => () => ({
  module: { loaders: [loaderConfig] }
});

module.exports = createConfig([
  entryPoint(['whatwg-fetch', './src/index.js']),
  setOutput('./build/bundle.js'),

  babel(),      // Enable ES6 syntax
  sass(),       // Use sass instead of CSS

  addLoader({
    test: /\.html$/,
    loaders: ['html-loader?attrs=img:src link:href']
  }),

  addLoader({
    test: /\.json$/,
    loaders: ['json-loader']
  }),

  // Pass some information into the build environment.
  defineConstants({
    'process.env.NODE_ENV': process.env.NODE_ENV,
    'process.env.MAPBOX_TOKEN': MAPBOX_TOKEN
  }),

  addPlugins([
    // Inject all assets into our html file.
    new HtmlWebpackPlugin({
      inject: 'head',
      template: 'src/index.html'
    })
  ]),

  // When running in development mode, enable source maps.
  env('development', [
    devServer(),
    sourceMaps()
  ]),

  env('production', [
    setOutput('./dist/bundle.js'),
    extractText(null, 'text/x-sass')
  ])
]);
