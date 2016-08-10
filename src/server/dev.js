/* eslint import/no-extraneous-dependencies: 0 */
import forever from 'forever-monitor';
import httpProxy from 'http-proxy';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import webpackConfig from './webpack.dev.config.js';

const proxyPort = process.env.PROXY_PORT || 3001;

export function addWebpackDevProxy(app) {
  const proxy = httpProxy.createProxyServer({
    changeOrigin: true,
  });

  app.all('/dist/*', (request, response) => {
    proxy.web(request, response, {
      target: `http://127.0.0.1:${proxyPort}`,
    });
  });

  proxy.on('error', (error, request, response) => {
    console.error(`Error proxying ${request.url}: ${error.stack}`);

    response.status(500).send('Error');
  });
}

export function startWebpackDevServer() {
  const compiler = webpack(webpackConfig);
  let bundleStart = null;

  compiler.plugin('compile', () => {
    console.log('Bundling...');
    bundleStart = Date.now();
  });

  compiler.plugin('done', () => {
    console.log(`Bundled in ${Date.now() - bundleStart} ms`);
  });

  const bundler = new WebpackDevServer(compiler, {
    colors: true,
    contentBase: 'dist',
    host: 'localhost',
    hot: false,
    info: false,
    inline: true,
    publicPath: '/dist/',
    quiet: true,
    stats: {
      colors: true,
    },
    watchOptions: {
      poll: 1000,
    },
  });

  bundler.listen(proxyPort, 'localhost', () => {
    console.log(`Webpack dev server running on port ${proxyPort}`);
  });
}

export function startForeverMonitorApp(appPath) {
  const app = new forever.Monitor(appPath, {
    usePolling: true,
    watch: true,
    watchDirectory: './src',
  }).start();

  app.on('watch:restart', (info) => {
    console.log(`\t${info.stat} changed`);
  });

  process.on('SIGTERM', () => {
    app.stop();
  });
}
