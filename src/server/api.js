import bodyParser from 'body-parser';
import express from 'express';

import {
  createCampaignRequestHandler,
  getUser,
  getUsers,
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

  app.use((req, res, next) => {
    if (req.store.currentUser == null) {
      res.status(403).send();
    } else {
      next();
    }
  });

  app.use('/campaigns', createCampaignRequestHandler(config));

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
