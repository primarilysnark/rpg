import { people } from 'googleapis';

import { User, prettifyUser } from '../models';

const peopleClient = people('v1');

export function getUsers(req, res, oauth2Client) {
  return User.find()
      .then(users => new Promise((resolve, reject) => {
        peopleClient.people.getBatchGet({
          resourceNames: users.map(user => `people/${user.google.id}`),
          auth: oauth2Client,
        }, (error, response) => {
          if (error) {
            reject(error);
          }

          resolve({
            users,
            responses: response.responses,
          });
        });
      }))
      .then(({ users, responses }) => res.status(200).json({
        data: users.map((user, index) => prettifyUser(user, responses[index].person)),
      }))
      .catch(err => res.status(500).send(err));
}

export function getUser(req, res, oauth2Client) {
  return User.findById(req.params.userId)
    .then(user => new Promise((resolve, reject) => {
      peopleClient.people.get({
        resourceName: `people/${user.google.id}`,
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
      .then(({ user, response }) => res.status(200).json({
        data: prettifyUser(user, response),
      }))
      .catch(err => res.status(500).send(err));
}
