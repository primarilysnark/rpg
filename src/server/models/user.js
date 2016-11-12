function mapDatabaseToPrettyUser(user) {
  return {
    id: user.id,
    avatarUrl: user.avatar_url,
    email: user.email,
    google: {
      id: user.google_id,
      token: user.google_token,
      refreshToken: user.google_refresh_token,
      expireTime: user.google_expire_time,
    },
    name: user.name,
  };
}

function mapPrettyUserToDatabase(user) {
  return {
    id: user.id,
    avatar_url: user.avatarUrl,
    email: user.email,
    google_id: user.google.id,
    google_token: user.google.token,
    google_refresh_token: user.google.refreshToken,
    google_expire_time: user.google.expireTime,
    name: user.name,
  };
}

export function fetchUserByGoogleId(connection, googleId) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users AS u WHERE u.google_id = ?', [
      googleId,
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

      return mapDatabaseToPrettyUser(results[0]);
    });
}

export function fetchUserById(connection, id) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users AS u WHERE u.id = ?', [
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

      return mapDatabaseToPrettyUser(results[0]);
    });
}

export function fetchUsersById(connection, ids) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users AS u WHERE u.id IN (?)', [
      ids,
    ], (error, results) => {
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

      return results.map(user => mapDatabaseToPrettyUser(user));
    });
}

export function fetchUsers(connection) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users', (error, results) => {
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

      return results.map(user => mapDatabaseToPrettyUser(user));
    });
}

export function saveUser(connection, prettyUser) {
  const databaseUser = mapPrettyUserToDatabase(prettyUser);

  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO users (avatar_url, email, name, google_id, google_token, google_refresh_token, google_expire_time) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      databaseUser.avatar_url,
      databaseUser.email,
      databaseUser.name,
      databaseUser.google_id,
      databaseUser.google_token,
      databaseUser.google_refresh_token,
      databaseUser.google_expire_time,
    ], (error, result) => {
      if (error) {
        return reject(error);
      }

      return resolve(result);
    });
  })
    .then(() => fetchUserByGoogleId(connection, databaseUser.google_id));
}

export function sanitizeUser(user) {
  const cleanedUser = user;
  delete cleanedUser.google;
  return cleanedUser;
}

export function updateUser(connection, prettyUser) {
  const databaseUser = mapPrettyUserToDatabase(prettyUser);

  return new Promise((resolve, reject) => {
    connection.query('UPDATE users SET avatar_url = ?, google_token = ?, google_expire_time = ?, name = ? WHERE id = ?', [
      databaseUser.avatar_url,
      databaseUser.google_token,
      databaseUser.google_expire_time,
      databaseUser.name,
      databaseUser.id,
    ], (error, result) => {
      if (error) {
        return reject(error);
      }

      return resolve(result);
    });
  })
    .then(() => prettyUser);
}
