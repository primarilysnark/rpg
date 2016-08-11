/* eslint no-param-reassign: 0 */
import session from 'express-session';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';

import { addWebpackDevProxy } from './dev';
import { configurePassportAuthentication } from './auth';
import * as main from '../app/server/main';
import config from './config';

const app = express();
const port = process.env.PORT || 3000;

configurePassportAuthentication(passport);

// Setup mongoose
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.connectionUrl);

if (!PRODUCTION) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
}

app.use('/dist', express.static('dist'));

if (DEBUG) {
  addWebpackDevProxy(app);
}

app.use(session({
  cookie: {
    secure: false,
  },
  resave: false,
  saveUninitialized: false,
  secret: config.session.secret,
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', {
  accessType: 'offline',
  approvalPrompt: 'force',
  scope: ['profile', 'email'],
}));

app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/',
}), (request, response) => {
  response.redirect('/');
});

app.use((request, response, next) => {
  request.store = {
    currentUser: request.user,
  };

  next();
});

app.use(main.createAppRequestHandler());

app.use((error, request, response) => {
  console.error(error.stack);

  response.status(500).send(DEBUG ? `<pre>${error.stack}</pre>` : 'Internal Server Error');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
