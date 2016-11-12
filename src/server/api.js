import bodyParser from 'body-parser';
import express from 'express';
import mysql from 'mysql';

import {
  createCampaign,
  getCampaign,
  getCampaigns,
  getUser,
  getUsers,
  deleteCampaign,
} from './controllers';

function requiresAuth(callback) {
  return (req, res) => {
    if (req.store.currentUser == null) {
      return res.status(403).send();
    }

    return callback(req, res);
  };
}

export function createApiRequestHandler(config) {
  const app = express();

  app.use(bodyParser.json());

  app.use((req, res, next) => {
    // eslint-disable-next-line no-param-reassign
    req.connection = mysql.createConnection(config.mysql);
    res.set('Content-Type', 'application/vnd.api+json');

    next();
  });

  app.route('/campaigns')
    .get(getCampaigns)
    .post(createCampaign);

  app.route('/campaigns/:campaignId')
    .get(getCampaign)
    .delete(deleteCampaign);

  return app;
}

export function createUserRequestHandler() {
  const app = express();

  app.use(bodyParser.json());

  app.route('/')
    .get(requiresAuth(getUsers));

  app.route('/:userId')
    .get(requiresAuth(getUser));

  return app;
}
