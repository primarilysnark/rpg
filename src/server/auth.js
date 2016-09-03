import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { auth, plus } from 'googleapis';

import { User } from './models';
import config from './config';

const plusClient = plus('v1');

export function setupGoogleOAuth(passport) {
  passport.use(new GoogleStrategy({
    callbackURL: config.google.callbackURL,
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
  }, (token, refreshToken, params, profile, done) => {
    const currentDate = Date.now();

    User.findOne({ 'google.id': profile.id })
      .then(user => {
        if (user == null) {
          const newUser = new User({
            google: {
              id: profile.id,
              token,
              refreshToken,
              expireTime: (currentDate + params.expires_in),
            },
          });

          return newUser.save()
            .then(() => newUser);
        }

        return user.update({
          google: {
            id: user.google.id,
            token,
            refreshToken,
            expireTime: currentDate + params.expires_in,
          },
        })
          .then(() => user);
      })
      .then(user => done(null, user))
      .catch(error => done(error));
  }));

  passport.serializeUser((user, callback) => {
    callback(null, user._id);
  });

  passport.deserializeUser((id, callback) => {
    const oauth2Client = new auth.OAuth2(
      config.google.clientID,
      config.google.clientSecret,
      config.google.callbackURL
    );

    User.findById(id)
      .then(user => {
        oauth2Client.setCredentials({
          access_token: user.google.token,
          refresh_token: user.google.refreshToken,
        });

        const currentDate = Date.now();

        return new Promise((resolve, reject) => {
          if (user.google.expireTime <= currentDate) {
            oauth2Client.refreshAccessToken((error, response) => {
              if (error) {
                reject(error);
              }

              resolve(user.update({
                google: {
                  id: user.google.id,
                  token: response.access_token,
                  refreshToken: user.google.refreshToken,
                  expireTime: response.expiry_date,
                },
              })
                .then(() => user));
            });
          } else {
            resolve(user);
          }
        });
      })
      .then(user => new Promise((resolve, reject) => {
        plusClient.people.get({ userId: 'me', auth: oauth2Client }, (error, response) => {
          if (error) {
            reject(error);
          }

          resolve({
            user,
            response,
          });
        });
      }))
      .then(result => callback(null, {
        ...result.user,
        id,
        name: result.response.displayName,
        nickname: result.response.nickname,
      }));
  });
}
