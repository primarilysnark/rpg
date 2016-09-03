import bodyParser from 'body-parser';
import express from 'express';

import {
  createCampaign,
  getCampaign,
  getCampaigns,
  deleteCampaign,
} from './controllers';

export function createApiRequestHandler() {
  const app = express();

  app.use(bodyParser.json());

  app.route('/campaigns')
    .get(getCampaigns)
    .post(createCampaign);

  app.route('/campaigns/:campaignId')
    .get(getCampaign)
    .delete(deleteCampaign);

  return app;
}
