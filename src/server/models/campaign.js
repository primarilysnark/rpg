function mapDatabaseToPrettyCampaign(campaign) {
  return {
    id: campaign.id,
    name: campaign.name,
  };
}

function mapPrettyCampaignToDatabase(campaign) {
  return {
    id: campaign.id,
    name: campaign.name,
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
    connection.query('INSERT INTO campaigns (name) VALUES (?)', [
      databaseCampaign.name,
    ], (error, result) => {
      if (error) {
        return reject(error);
      }

      return resolve(result);
    });
  })
    .then(result => fetchCampaignById(connection, result.insertId));
}
