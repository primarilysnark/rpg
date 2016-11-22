import Joi from 'joi';

import { SqlService } from './sql-service';
import { tokenize } from '../utils/tokenize';
import { validateObject } from '../utils/validation';

function mapDatabaseToPrettyCampaign(campaign) {
  return {
    id: campaign.id,
    attributes: {
      name: campaign.name,
      token: campaign.token,
      createdDate: campaign.created_date,
      lastUpdatedDate: campaign.last_updated_date,
    },
    links: {
      self: `/api/campaigns/${campaign.id}`,
    },
    relationships: {
      creator: {
        data: {
          id: campaign.creator_user_id,
          type: 'people',
        },
      },
    },
    type: 'campaigns',
  };
}

function mapPrettyCampaignToDatabase(campaign) {
  return {
    id: campaign.id,
    creator_user_id: campaign.relationships.creator.data.id,
    name: campaign.attributes.name,
    token: campaign.attributes.token,
  };
}

export class CampaignService extends SqlService {
  static campaignSchema = Joi.object().keys({
    id: Joi.number(),
    attributes: Joi.object().keys({
      name: Joi.string().min(1).max(200).required(),
      token: Joi.string().min(1).max(200),
      createdDate: Joi.date(),
      lastUpdatedDate: Joi.date(),
    }).required(),
    links: Joi.object().keys({
      self: Joi.string().regex(/\/api\/campaigns\/\d+/).required(),
    }),
    relationships: Joi.object().keys({
      creator: Joi.object().keys({
        data: Joi.object().keys({
          id: Joi.number().required(),
          type: Joi.string().valid('people').required(),
        }).required(),
      }).required(),
    }).required(),
    type: Joi.string().valid('campaigns').required(),
  });

  static campaignIdSchema = Joi.object().keys({
    campaignId: Joi.number().required(),
  });

  constructor({ connection }) {
    super({ connection });
  }

  deleteCampaignById = (id) => this._query('DELETE FROM campaigns WHERE id = ?', [
    id,
  ]);

  fetchCampaignById = (id) => this._query('SELECT c.*, cu.user_id AS creator_user_id FROM campaigns c, campaign_users cu WHERE c.id = ? && c.id = cu.campaign_id && cu.status = \'creator\';', [
    id,
  ])
    .then(results => {
      if (results.length === 0) {
        return null;
      }

      return mapDatabaseToPrettyCampaign(results[0]);
    });

  fetchCampaignsByUserId = (userId) => this._query('SELECT c.*, cu.user_id AS creator_user_id FROM campaigns c INNER JOIN campaign_users cu ON cu.campaign_id = c.id WHERE cu.user_id = ?;', [
    userId,
  ])
    .then(results => {
      if (results.length === 0) {
        return [];
      }

      return results.map(campaign => mapDatabaseToPrettyCampaign(campaign));
    });

  saveCampaign = (prettyCampaign) => {
    const databaseCampaign = mapPrettyCampaignToDatabase(prettyCampaign);

    if (databaseCampaign.token == null) {
      databaseCampaign.token = tokenize(databaseCampaign.name);
    }

    return this._beginTransaction()
      .then(() => this._query('SELECT IF(EXISTS(SELECT 1 as token_id FROM campaigns WHERE token = ?), MAX(id), NULL) AS token_id FROM campaigns;', [
        databaseCampaign.token,
      ]))
      .then(result => {
        if (result[0].token_id !== null) {
          databaseCampaign.token = `${databaseCampaign.token}-${result[0].token_id}`;
        }
      })
      .then(() => this._query('INSERT INTO campaigns (name, token) VALUES (?, ?)', [
        databaseCampaign.name,
        databaseCampaign.token,
      ]))
      .then(result => this._query('INSERT INTO campaign_users (campaign_id, user_id, status) VALUES (?, ?, \'creator\')', [
        result.insertId,
        databaseCampaign.creator_user_id,
      ])
        .then(() => result)
      )
      .then(result => this._commitTransaction(result))
      .then(result => this.fetchCampaignById(result.insertId));
  };

  validateCampaign = (campaignObject) => validateObject(campaignObject, CampaignService.campaignSchema);

  validateCampaignId = (campaignIdObject) => validateObject(campaignIdObject, CampaignService.campaignIdSchema);
}
