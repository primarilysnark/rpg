import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { auth, people } from 'googleapis';

import { User, prettifyUser } from './models';
import config from './config';

const peopleClient = people('v1');

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

        if (user.google.expireTime > currentDate) {
          return user;
        }

        return new Promise((resolve, reject) => {
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
        });
      })
      .then(user => new Promise((resolve, reject) => {
        peopleClient.people.get({
          resourceName: 'people/me',
          auth: oauth2Client,
        }, (error, response) => {
          if (error) {
            reject(error);
          }

          resolve({
            user,
            response,
          });
        });
      }))
      .then(({ user, response }) => callback(null, prettifyUser(user, response)))
      .catch(error => callback(error));
  });
}
