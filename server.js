const express = require('express')
const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const port = 3001
const app = express()
const config = require('./webpack.config.js')
const compiler = webpack(config)

app.use(express.json())

app.get('/', (req, res, next) => {
  next()
})

// dev
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
)

app.use(express.static(__dirname))

app.listen(port, function () {
  console.log(`개발서버 구동중이야... localhost:${port}`)
})
