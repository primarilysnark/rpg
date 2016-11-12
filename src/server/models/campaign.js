import Joi from 'joi';

export const CampaignSchema = Joi.object().keys({
  id: Joi.number(),
  attributes: Joi.object().keys({
    creatorId: Joi.number().required(),
    name: Joi.string().min(1).max(200).required(),
  }).required(),
  type: Joi.string().valid('campaigns').required(),
});

function mapDatabaseToPrettyCampaign(campaign) {
  return {
    id: campaign.id,
    attributes: {
      creatorId: campaign.creator_user_id,
      name: campaign.name,
    },
    type: 'campaigns',
  };
}

function mapPrettyCampaignToDatabase(campaign) {
  return {
    id: campaign.id,
    creator_user_id: campaign.attributes.creatorId,
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
