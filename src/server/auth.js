import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { auth, plus } from 'googleapis';

import config from './config';
import {
  fetchUserByGoogleId,
  fetchUserById,
  saveUser,
  updateUser,
} from './models';

const plusClient = plus('v1');

export function setupGoogleOAuth(passport, connection) {
  passport.use(new GoogleStrategy({
    callbackURL: config.google.callbackURL,
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
  }, (token, refreshToken, params, profile, done) => {
    const currentDate = Date.now();

    fetchUserByGoogleId(connection, profile.id)
      .then(user => {
        const expireTime = currentDate + params.expires_in;

        if (user == null) {
          return saveUser(connection, {
            avatarUrl: profile.photos[0].value,
            email: profile.emails[0].value,
            google: {
              id: profile.id,
              expireTime,
              refreshToken,
              token,
            },
            name: profile.displayName,
          });
        }

        return updateUser(connection, {
          ...user,
          google: {
            ...user.google,
            expireTime,
            token,
          },
        });
      })
      .then(user => done(null, user))
      .catch(error => done(error));
  }));

  passport.serializeUser((user, callback) => {
    callback(null, user.id);
  });

  passport.deserializeUser((id, callback) => {
    const oauth2Client = new auth.OAuth2(
      config.google.clientID,
      config.google.clientSecret,
      config.google.callbackURL
    );

    fetchUserById(connection, id)
      .then(user => {
        oauth2Client.setCredentials({
          access_token: user.google.token,
          refresh_token: user.google.refreshToken,
        });

        const currentDate = Date.now();

        if (user.google.expireTime === currentDate) {
          return user;
        }

        return new Promise((resolve, reject) => {
          oauth2Client.refreshAccessToken((error, response) => {
            if (error) {
              reject(error);
            }

            plusClient.people.get({
              auth: oauth2Client,
              userId: user.google.id,
            }, (plusError, profile) => {
              if (plusError) {
                reject(error);
              }

              resolve(updateUser(connection, {
                ...user,
                avatarUrl: profile.image.url,
                google: {
                  ...user.google,
                  expireTime: response.expiry_date,
                  token: response.access_token,
                },
                name: profile.displayName,
              })
                .then(() => user));
            });
          });
        });
      })
      .then(user => callback(null, user))
      .catch(error => callback(error));
  });
}
