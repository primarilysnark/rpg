import { auth } from 'googleapis';
import bodyParser from 'body-parser';
import express from 'express';

import { User } from './models';
import config from './config';
import {
  createCampaign,
  getCampaign,
  getCampaigns,
  getUser,
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

function setupGoogleClient(callback) {
  return requiresAuth((req, res) => {
    const oauth2Client = new auth.OAuth2(
      config.google.clientID,
      config.google.clientSecret,
      config.google.callbackURL
    );

    User.findById(req.store.currentUser.id)
      .then(user => {
        oauth2Client.setCredentials({
          access_token: user.google.token,
          refresh_token: user.google.refreshToken,
        });

        return callback(req, res, oauth2Client);
      });
  });
}

export function createApiRequestHandler() {
  const app = express();

  app.use(bodyParser.json());

  app.route('/campaigns')
    .get(getCampaigns)
    .post(createCampaign);

  app.route('/campaigns/:campaignId')
    .get(getCampaign)
    .delete(deleteCampaign);

  app.route('/users/:userId')
    .get(setupGoogleClient(getUser));

  return app;
}
