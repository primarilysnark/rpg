function mapDatabaseToPrettyRace(race) {
  return {
    id: race.id,
    alignment: race.alignment.split('\n\n'),
    description: race.description.split('\n\n'),
    name: race.name,
    physicalDescription: race.physical_description.split('\n\n'),
    relations: race.relations.split('\n\n'),
    society: race.society.split('\n\n'),
    tagline: race.tagline,
  };
}

function mapPrettyRaceToDatabase(race) {
  return {
    id: race.id,
    alignment: race.alignment.join('\n\n'),
    description: race.description.join('\n\n'),
    name: race.name,
    physical_description: race.physicalDescription.join('\n\n'),
    relations: race.relations.join('\n\n'),
    society: race.society.join('\n\n'),
    tagline: race.tagline,
  };
}

export function deleteRaceById(connection, id) {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM races WHERE id = ?', [
      id,
    ], (error, results) => {
      if (error) {
        return reject(error);
      }

      return resolve(results);
    });
  });
}

export function fetchRaceById(connection, id) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM races r WHERE r.id = ?', [
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

      return mapDatabaseToPrettyRace(results[0]);
    });
}

export function fetchRaces(connection) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM races', (error, results) => {
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

      return results.map(race => mapDatabaseToPrettyRace(race));
    });
}

export function saveRace(connection, prettyRace) {
  const databaseRace = mapPrettyRaceToDatabase(prettyRace);

  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO races (name, alignment, description, physical_description, relations, society, tagline) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      databaseRace.name,
      databaseRace.alignment,
      databaseRace.description,
      databaseRace.physical_description,
      databaseRace.relations,
      databaseRace.society,
      databaseRace.tagline,
    ], (error, result) => {
      if (error) {
        return reject(error);
      }

      return resolve(result);
    });
  })
    .then(result => fetchRaceById(connection, result.insertId));
}
