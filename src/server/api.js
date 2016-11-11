import bodyParser from 'body-parser';
import express from 'express';

import {
  createAlignment,
  createCampaign,
  createRace,
  getAlignment,
  getAlignments,
  getCampaign,
  getCampaigns,
  getRace,
  getRaces,
  getUser,
  getUsers,
  deleteAlignment,
  deleteCampaign,
  deleteRace,
} from './controllers';

function requiresAuth(callback) {
  return (req, res) => {
    if (req.store.currentUser == null) {
      return res.status(403).send();
    }

    return callback(req, res);
  };
}

export function createApiRequestHandler() {
  const app = express();

  app.use(bodyParser.json());

  app.route('/alignments')
    .get(getAlignments)
    .post(createAlignment);

  app.route('/alignments/:alignmentId')
    .get(getAlignment)
    .delete(deleteAlignment);

  app.route('/campaigns')
    .get(getCampaigns)
    .post(createCampaign);

  app.route('/campaigns/:campaignId')
    .get(getCampaign)
    .delete(deleteCampaign);

  app.route('/races')
    .get(getRaces)
    .post(createRace);

  app.route('/races/:raceId')
    .get(getRace)
    .delete(deleteRace);

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
