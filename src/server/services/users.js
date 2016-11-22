import Joi from 'joi';

import { SqlService } from './sql-service';

export function mapDatabaseToPrettyUser(user) {
  return {
    id: user.id,
    attributes: {
      avatarUrl: user.avatar_url,
      email: user.email,
      name: user.name,
    },
    google: {
      id: user.google_id,
      token: user.google_token,
      refreshToken: user.google_refresh_token,
      expireTime: user.google_expire_time,
    },
    type: 'people',
  };
}

function mapPrettyUserToDatabase(user) {
  return {
    id: user.id,
    avatar_url: user.attributes.avatarUrl,
    email: user.attributes.email,
    google_id: user.google.id,
    google_token: user.google.token,
    google_refresh_token: user.google.refreshToken,
    google_expire_time: user.google.expireTime,
    name: user.attributes.name,
  };
}

export class UserService extends SqlService {
  static sanitizeUser = (user) => {
    const cleanedUser = user;
    delete cleanedUser.google;
    return cleanedUser;
  };

  static userSchema = Joi.object().keys({
    id: Joi.number(),
    attributes: Joi.object().keys({
      avatarUrl: Joi.string().min(1).max(200).required(),
      email: Joi.string().min(1).max(200).required(),
      name: Joi.string().min(1).max(200).required(),
    }).required(),
    links: Joi.object().keys({
      self: Joi.string().regex(/\/api\/users\/\d+/).required(),
    }),
    type: Joi.string().valid('people').required(),
  });

  constructor({ connection }) {
    super({ connection });
  }

  fetchUsersByCampaignId = (campaignId) => this._query('SELECT users.*, campaign_users.status FROM campaign_users INNER JOIN users ON users.id = campaign_users.user_id WHERE campaign_users.campaign_id = ?', [
    campaignId,
  ])
    .then(results => ({
      players: results.filter(result => result.status === 'accepted').map(mapDatabaseToPrettyUser),
      invited: results.filter(result => result.status === 'invited').map(mapDatabaseToPrettyUser),
    }));

  fetchUserByGoogleId = (googleId) => this._query('SELECT * FROM users AS u WHERE u.google_id = ?', [
    googleId,
  ])
    .then(results => {
      if (results.length === 0) {
        return null;
      }

      return mapDatabaseToPrettyUser(results[0]);
    });

  fetchUserById = (id) => this._query('SELECT * FROM users AS u WHERE u.id = ?', [
    id,
  ])
    .then(results => {
      if (results.length === 0) {
        return null;
      }

      return mapDatabaseToPrettyUser(results[0]);
    });

  fetchUsers = () => this._query('SELECT * FROM users')
    .then(results => {
      if (results.length === 0) {
        return [];
      }

      return results.map(user => mapDatabaseToPrettyUser(user));
    });

  fetchUsersById = (ids = []) => this._query('SELECT * FROM users AS u WHERE u.id IN (?)', [
    ids,
  ])
    .then(results => {
      if (results.length === 0) {
        return [];
      }

      return results.map(user => mapDatabaseToPrettyUser(user));
    });

  saveUser = (prettyUser) => {
    const databaseUser = mapPrettyUserToDatabase(prettyUser);

    return this._query('INSERT INTO users (avatar_url, email, name, google_id, google_token, google_refresh_token, google_expire_time) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      databaseUser.avatar_url,
      databaseUser.email,
      databaseUser.name,
      databaseUser.google_id,
      databaseUser.google_token,
      databaseUser.google_refresh_token,
      databaseUser.google_expire_time,
    ])
      .then(result => this.fetchUserById(result.insertId));
  }

  updateUser = (prettyUser) => {
    const databaseUser = mapPrettyUserToDatabase(prettyUser);

    return this._query('UPDATE users SET avatar_url = ?, google_token = ?, google_expire_time = ?, name = ? WHERE id = ?', [
      databaseUser.avatar_url,
      databaseUser.google_token,
      databaseUser.google_expire_time,
      databaseUser.name,
      databaseUser.id,
    ])
      .then(() => prettyUser);
  }
}
