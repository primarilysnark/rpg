import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import google from 'googleapis';

import User from './models/user';
import config from './config';

const plus = google.plus('v1');
const oauth2Client = new google.auth.OAuth2(config.google.clientID, config.google.clientSecret, config.google.callbackURL);

export function configurePassportAuthentication(passport) {
  // Initialize Passport
  passport.use(new GoogleStrategy({
    callbackURL: config.google.callbackURL,
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
  }, (token, refreshToken, profile, done) => {
    User.findOne({ 'google.id': profile.id }, (error, user) => {
      if (error) {
        return done(error);
      }

      if (user) {
        return done(null, user);
      }

      const newUser = new User({
        google: {
          id: profile.id,
          token,
          refreshToken,
        },
      });

      return newUser.save()
        .then(() => done(null, newUser))
        .catch(saveError => saveError);
    });
  }));

  passport.serializeUser((user, callback) => callback(null, user._id));

  passport.deserializeUser((id, callback) => {
    User.findById(id)
      .then(user => {
        oauth2Client.setCredentials({
          access_token: user.google.token,
          refresh_token: user.google.refreshToken,
        });

        plus.people.get({ userId: 'me', auth: oauth2Client }, (error, response) => callback(null, {
          ...user,
          name: response.displayName,
          nickname: response.nickname,
        }));
      });
  });
}
