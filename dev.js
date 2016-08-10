/* eslint no-var: 0 */
require('babel-core/register')({
  only: `${__dirname}/src`,
});

const dev = require('./src/server/dev');

dev.startWebpackDevServer();
dev.startForeverMonitorApp('./server.js');
