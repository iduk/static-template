const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const purgecss = require('@fullhuman/postcss-purgecss')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HandlebarsPlugin = require('handlebars-webpack-plugin')

const devMode = process.env.NODE_ENV !== 'production'

// Basic Path
const PATHS = {
  src: path.join(__dirname, 'src'),
}

const srcPath = path.join(__dirname, 'src')
const templatePath = path.join(__dirname, 'template')
const buildPath = path.join(__dirname, 'dist')

module.exports = {
  mode: 'development',

  entry: {
    main: './src/index.js',
  },

  output: {
    filename: '[name].[hash].js',
    path: buildPath,
    assetModuleFilename: 'assets/[name][ext]', // 리소스 경로 구성
    clean: true, // 생성된 파일만 보임
    publicPath: '/',
  },

  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },

  // 최적화 설정
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },

  devtool: 'cheap-source-map',
  devServer: {
    static: './dist',
    historyApiFallback: true,
    port: 3333,

    client: {
      progress: true,
      webSocketTransport: 'ws',
    },
    webSocketServer: 'ws',
  },
  stats: {
    assets: true,
    children: false,
    colors: true,
    entrypoints: false,
    hash: false,
    modules: false,
    version: false,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },

      // css & scss
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: true,
              modules: {
                auto: true,
                localIdentName: '[local]__[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'postcss-preset-env',
                  [
                    '@fullhuman/postcss-purgecss',
                    {
                      content: [
                        path.join(__dirname, './public/index.html'),
                        ...glob.sync(`${path.join(__dirname, 'src')}/**/*.js`, {
                          nodir: true,
                        }),
                      ],
                    },
                  ],
                ],
              },
            },
          },
          // scss
          {
            loader: 'sass-loader',
            options: {
              implementation: require.resolve('sass'),
              sassOptions: {
                fiber: require('fibers'), // 속도향상
              },
              additionalData: `
              @import "${PATHS.src}/assets/scss/variables";
              `,
            },
          },
        ],
      },

      // assets
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext][query]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext][query]',
        },
      },
      {
        test: /\.svg/,
        type: 'asset/inline',
      },
      // html
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: { minimize: false },
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'template', 'template.hbs'),
    }),

    new HandlebarsPlugin({
      htmlWebpackPlugin: {
        enabled: true,
        prefix: 'html',
      },

      entry: path.join(srcPath, 'template', '*.hbs'),
      output: path.join(buildPath, '[name].html'),

      partials: [
        path.join(templatePath, 'template.hbs'),
        path.join(srcPath, 'template', 'partials', '*.hbs'),
      ],

      // hooks
      // getTargetFilepath: function (filepath, outputTemplate) {},
      // getPartialId: function (filePath) {}
      onBeforeSetup: function (Handlebars) {},
      onBeforeAddPartials: function (Handlebars, partialsMap) {},
      onBeforeCompile: function (Handlebars, templateContent) {},
      onBeforeRender: function (Handlebars, data, filename) {},
      onBeforeSave: function (Handlebars, resultHtml, filename) {},
      onDone: function (Handlebars, filename) {},
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].[contenthash].css',
    }),

    // * 사용안된 Css 제거 (dev)
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*.css`, { nodir: true }),
    }),

    new CleanWebpackPlugin(),
  ],
}
