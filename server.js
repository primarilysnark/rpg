/* eslint no-var: 0 */
var env = process.env.NODE_ENV;
var path = require('path');

require('babel-core/register')({
  only: path.join(__dirname, '/src'),
});

require.extensions['.less'] = function ignoreLessFiles() {};

global.DEBUG = env !== 'production' && env !== 'internal';
global.PRODUCTION = env === 'production';
global.CLIENT = false;

require('./src/server');
