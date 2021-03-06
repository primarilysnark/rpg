import path from 'path';
import validator from 'node-validator';

import findConfig from './find-config';

export default findConfig({
  environment: process.env.NODE_ENV || 'internal',
  configLocation: path.join(path.dirname(module.filename), 'environments'),
  configTemplate: {
    google: {
      callbackURL: validator.isString(),
      clientID: validator.isString(),
      clientSecret: validator.isString(),
    },
    mysql: {
      database: validator.isString(),
      host: validator.isString(),
      password: validator.isString(),
      user: validator.isString(),
    },
    session: {
      secret: validator.isString(),
    },
  },
});
