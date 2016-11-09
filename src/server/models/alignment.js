function mapDatabaseToPrettyAlignment(alignment) {
  return {
    id: alignment.id,
    description: alignment.description.split('\n\n'),
    name: alignment.name,
    tagline: alignment.tagline,
  };
}

function mapPrettyAlignmentToDatabase(alignment) {
  return {
    id: alignment.id,
    description: alignment.description.join('\n\n'),
    name: alignment.name,
    tagline: alignment.tagline,
  };
}

export function deleteAlignmentById(connection, id) {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM alignments WHERE id = ?', [
      id,
    ], (error, results) => {
      if (error) {
        return reject(error);
      }

      return resolve(results);
    });
  });
}

export function fetchAlignmentById(connection, id) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM alignments a WHERE a.id = ?', [
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

      return mapDatabaseToPrettyAlignment(results[0]);
    });
}

export function fetchAlignments(connection) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM alignments', (error, results) => {
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

      return results.map(alignment => mapDatabaseToPrettyAlignment(alignment));
    });
}

export function saveAlignment(connection, prettyAlignment) {
  const databaseAlignment = mapPrettyAlignmentToDatabase(prettyAlignment);

  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO alignments (name, tagline, description) VALUES (?, ?, ?)', [
      databaseAlignment.name,
      databaseAlignment.tagline,
      databaseAlignment.description,
    ], (error, result) => {
      if (error) {
        return reject(error);
      }

      return resolve(result);
    });
  })
    .then(result => fetchAlignmentById(connection, result.insertId));
}
