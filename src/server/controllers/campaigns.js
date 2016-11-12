import Joi from 'joi';

import {
  CampaignSchema,
  deleteCampaignById,
  fetchCampaignById,
  fetchCampaigns,
  fetchUsersById,
  sanitizeUser,
  saveCampaign,
} from '../models';
import { formatValidationErrors, validateObject } from './util';

const campaignIdSchema = Joi.object().keys({
  campaignId: Joi.number().required(),
});

export function createCampaign(req, res) {
  return validateObject(req.body, CampaignSchema)
    .catch(errors => res.status(400).json({
      errors: formatValidationErrors(errors),
    }))
    .then(value => saveCampaign(req.connection, value))
    .then(campaign => fetchUsersById(req.connection, campaign.relationships.creator.data.id)
      .then(users => ({
        data: campaign,
        included: users.map(sanitizeUser),
      }))
    )
    .then(response => res.status(201).json(response))
    .catch(error => res.status(500).send(error));
}

export function getCampaign(req, res) {
  return validateObject(req.params, campaignIdSchema)
    .catch(errors => res.status(400).json({
      errors: formatValidationErrors(errors, true),
    }))
    .then(params => fetchCampaignById(req.connection, params.campaignId))
    .then(campaign => {
      if (campaign == null) {
        return res.status(404).send();
      }

      return campaign;
    })
    .then(campaign => fetchUsersById(req.connection, campaign.relationships.creator.data.id)
      .then(users => ({
        data: campaign,
        included: users.map(sanitizeUser),
      }))
    )
    .then(response => res.status(200).json(response))
    .catch(err => res.status(404).send(err));
}

export function getCampaigns(req, res) {
  return fetchCampaigns(req.connection)
    .then(campaigns => fetchUsersById(req.connection, campaigns.map(campaign => campaign.relationships.creator.data.id))
      .then(users => ({
        data: campaigns,
        included: users.map(sanitizeUser),
      }))
    )
    .then(response => res.status(200).json(response))
    .catch(err => res.status(500).send(err));
}

export function deleteCampaign(req, res) {
  return validateObject(req.params, campaignIdSchema)
    .catch(errors => res.status(400).json({
      errors: formatValidationErrors(errors, true),
    }))
    .then(params => fetchCampaignById(req.connection, params.campaignId))
    .then(campaign => {
      if (campaign == null) {
        return res.status(404).send();
      }

      return deleteCampaignById(req.connection, campaign.id);
    })
    .then(() => res.status(204).send())
    .catch(err => res.status(404).send(err));
}
