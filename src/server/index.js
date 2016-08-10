import express from 'express';
import sessions from 'client-sessions';

import { addWebpackDevProxy } from './dev';
import * as main from '../app/server/main';
import config from './config';

const app = express();
const port = process.env.PORT || 3000;

if (!PRODUCTION) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
}

app.use('/dist', express.static('dist'));

if (DEBUG) {
  addWebpackDevProxy(app);
}

app.use(sessions({
  cookieName: 'auth',
  duration: 1000 * 60 * 60 * 24 * 365 * 10,
  ephemeral: false,
  httpOnly: true,
  secret: config.session.secret,
  secure: PRODUCTION,
}));

app.use(main.createAppRequestHandler());

app.use((error, request, response) => {
  console.error(error.stack);

  response.status(500).send(DEBUG ? `<pre>${error.stack}</pre>` : 'Internal Server Error');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
