/* eslint no-param-reassign: 0 */
import express from 'express';
import mysql from 'mysql';
import mysqlSession from 'express-mysql-session';
import passport from 'passport';
import session from 'express-session';
import mongoose from 'mongoose';

import { addWebpackDevProxy } from './dev';
import { createApiRequestHandler, createUserRequestHandler } from './api';
import { createAppRequestHandler } from '../app/server/main';
import { setupGoogleOAuth } from './auth';
import config from './config';

const MySQLStore = mysqlSession(session);
const app = express();
const port = process.env.PORT || 3000;

// Setup MongoDB connections
// This includes Mongoose for models
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.connectionUrl);

// Setup MySQL connections
// This includes initial connection and express-mysql-session for session storage
const connection = mysql.createConnection(config.mysql);

// If running a development environment, ignore TLS errors from self-signed certs
// Additionally setup webpack dev proxy as necessary
if (!PRODUCTION) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
}

if (DEBUG) {
  addWebpackDevProxy(app);
}

// Setup serving of public resources
app.use('/dist', express.static('dist'));
app.use('/public', express.static('public'));

app.use((req, res, next) => {
  req.connection = mysql.createConnection(config.mysql);

  next();
});

app.use(/\/api(?!\/users)/, createApiRequestHandler());

// Setup app session
// TODO (Josh): Setup use of secure cookies, even with just a self-signed cert
// TODO (Josh): Use a better session secret
app.use(session({
  cookie: {
    secure: false,
  },
  resave: false,
  saveUninitialized: false,
  secret: config.session.secret,
  store: new MySQLStore({}, connection),
}));

// Configure Passport to use the Google OAuth 2.0 strategy
// Additionally setup Express to use Passport for authentication
setupGoogleOAuth(passport, connection);

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', {
  accessType: 'offline',
  prompt: 'consent',
  scope: [
    'profile',
    'email',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/plus.login',
  ],
}));

app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/',
}), (request, response) => {
  response.redirect('/');
});

// If the user is logged in, setup the store to include the current user
// This can be used down the line by the top level component of the React render
app.use((request, response, next) => {
  request.store = {
    ...request.store,
    currentUser: request.user,
  };

  next();
});

app.post('/signout', (request, response) => {
  request.session.destroy(err => {
    if (err != null) {
      response.status(500).send(err);
    }

    response.redirect('/');
  });
});

app.use('/api/users', createUserRequestHandler());

// Setup usage of React router for routing on all other pages
app.use(createAppRequestHandler());

// If we've reached this point, bad things are happening and it should spit out a stack trace
// TODO (Josh): Move this behind DEV flag with a pretty error page for production
app.use((error, request, response) => {
  console.error(error.stack);

  response.status(500).send(DEBUG ? `<pre>${error.stack}</pre>` : 'Internal Server Error');
});

// And finally open for listening
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
