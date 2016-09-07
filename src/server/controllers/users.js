import { plus } from 'googleapis';

import { User, prettifyUser } from '../models';

const plusClient = plus('v1');

export function getUser(req, res, oauth2Client) {
  return User.findById(req.params.userId)
    .then(user => new Promise((resolve, reject) => {
      plusClient.people.get({ userId: user.google.id, auth: oauth2Client }, (error, response) => {
        if (error) {
          reject(error);
        }

        resolve({
          user,
          response,
        });
      });
    }))
    .then(({ user, response }) => res.status(200).json({
      data: prettifyUser(user, response),
    }))
    .catch(err => res.status(500).send(err));
}
