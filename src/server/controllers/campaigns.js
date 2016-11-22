import bodyParser from 'body-parser';
import express from 'express';
import mysql from 'mysql';

import { CampaignService, UserService } from '../services';
import { formatValidationErrors } from './util';

function createCampaign(req, res) {
  const { campaignService, userService } = req;

  return campaignService.validateCampaign(req.body)
    .catch(errors => res.status(400).json({
      errors: formatValidationErrors(errors),
    }))
    .then(campaign => campaignService.saveCampaign(campaign))
    .then(campaign => userService.fetchUsersById(campaign.relationships.creator.data.id)
      .then(users => ({
        data: campaign,
        included: users.map(UserService.sanitizeUser),
      }))
    )
    .then(response => res.status(201).json(response))
    .catch(error => res.status(500).send(error));
}

function deleteCampaign(req, res) {
  const { campaignService } = req;

  return campaignService.validateCampaignId(req.params)
    .catch(errors => res.status(400).json({
      errors: formatValidationErrors(errors, true),
    }))
    .then(params => campaignService.fetchCampaignById(params.campaignId))
    .then(campaign => {
      if (campaign == null) {
        throw new Error('Campaign not found');
      }

      return campaignService.deleteCampaignById(campaign.id);
    })
    .then(() => res.status(204).send())
    .catch(err => res.status(404).send(err));
}

function getCampaign(req, res) {
  const { campaignService, userService } = req;

  return campaignService.validateCampaignId(req.params)
    .catch(errors => res.status(400).json({
      errors: formatValidationErrors(errors, true),
    }))
    .then(params => campaignService.fetchCampaignById(params.campaignId))
    .then(campaign => {
      if (campaign == null) {
        throw new Error('Campaign not found');
      }

      return campaign;
    })
    .catch(err => res.status(404).send(err))
    .then(campaign => Promise.all([
      userService.fetchUserById(campaign.relationships.creator.data.id),
      userService.fetchUsersByCampaignId(campaign.id),
    ])
      .then(([creator, users]) => {
        const data = {
          ...campaign,
        };

        if (users.players.length !== 0) {
          data.relationships.players = {
            data: users.players.map(player => ({
              id: player.id,
              type: 'people',
            })),
          };
        }

        if (users.invited.length !== 0) {
          data.relationships.invited = {
            data: users.invited.map(player => ({
              id: player.id,
              type: 'people',
            })),
          };
        }

        return {
          data,
          included: [creator].concat(users.players).concat(users.invited).map(UserService.sanitizeUser),
        };
      })
    )
    .then(response => res.status(200).json(response))
    .catch(err => res.status(404).send(err));
}

function getCampaigns(req, res) {
  const { campaignService } = req;

  if (req.store == null || req.store.currentUser == null || req.store.currentUser.id == null) {
    return res.status(401).send();
  }

  return campaignService.fetchCampaignsByUserId(req.store.currentUser.id)
    /* .then(campaigns => fetchUsersById(req.connection, campaigns.map(campaign => campaign.relationships.creator.data.id))
      .then(users => ({
        data: campaigns,
        included: users.map(sanitizeUser),
      }))
    ) */
    .then(campaigns => ({
      data: campaigns,
    }))
    .then(response => res.status(200).json(response))
    .catch(err => res.status(500).send(err));
}

export function createCampaignRequestHandler(config) {
  const app = express();

  app.use(bodyParser.json());

  app.use((req, res, next) => {
    // eslint-disable-next-line no-param-reassign
    req.connection = mysql.createConnection(config.mysql);
    // eslint-disable-next-line no-param-reassign
    req.campaignService = new CampaignService({
      connection: req.connection,
    });
    // eslint-disable-next-line no-param-reassign
    req.userService = new UserService({
      connection: req.connection,
    });

    next();
  });

  app.route('/')
    .get(getCampaigns)
    .post(createCampaign);

  app.route('/:campaignId')
    .get(getCampaign)
    .delete(deleteCampaign);

  return app;
}
