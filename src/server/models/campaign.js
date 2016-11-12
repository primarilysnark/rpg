import Joi from 'joi';

export const CampaignSchema = Joi.object().keys({
  id: Joi.number(),
  attributes: Joi.object().keys({
    name: Joi.string().min(1).max(200).required(),
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

function mapDatabaseToPrettyCampaign(campaign) {
  return {
    id: campaign.id,
    attributes: {
      name: campaign.name,
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
  };
}

export function deleteCampaignById(connection, id) {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM campaigns WHERE id = ?', [
      id,
    ], (error, results) => {
      if (error) {
        return reject(error);
      }

      return resolve(results);
    });
  });
}

export function fetchCampaignById(connection, id) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM campaigns c WHERE c.id = ?', [
      id,
    ], (error, results) => {
      if (error) {
        return reject(error);
      }

      return resolve(results);
    });
  })
    .then(results => {
      if (results.length === 0) {
        return null;
      }

      return mapDatabaseToPrettyCampaign(results[0]);
    });
}

export function fetchCampaigns(connection) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM campaigns', (error, results) => {
      if (error) {
        return reject(error);
      }

      return resolve(results);
    });
  })
    .then(results => {
      if (results.length === 0) {
        return [];
      }

      return results.map(campaign => mapDatabaseToPrettyCampaign(campaign));
    });
}

export function saveCampaign(connection, prettyCampaign) {
  const databaseCampaign = mapPrettyCampaignToDatabase(prettyCampaign);

  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO campaigns (name, creator_user_id) VALUES (?, ?)', [
      databaseCampaign.name,
      databaseCampaign.creator_user_id,
    ], (error, result) => {
      if (error) {
        return reject(error);
      }

      return resolve(result);
    });
  })
    .then(result => fetchCampaignById(connection, result.insertId));
}
