import express from 'express';

import {
  createCampaignRequestHandler,
  createUserRequestHandler,
} from './controllers';

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
  app.use('/users', createUserRequestHandler(config));

  return app;
}
