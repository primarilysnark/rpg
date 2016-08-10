import path from 'path';
import validator from 'node-validator';

import findConfig from './find-config';

export default findConfig({
  environment: process.env.NODE_ENV || 'internal',
  configLocation: path.join(path.dirname(module.filename), 'environments'),
  configTemplate: {
    session: {
      secret: validator.isString(),
    },
  },
});
