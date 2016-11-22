import bodyParser from 'body-parser';
import express from 'express';
import mysql from 'mysql';

import { UserService } from '../services';

export function getUsers(req, res) {
  const { userService } = req;

  return userService.fetchUsers()
    .then(users => users.map(UserService.sanitizeUser))
    .then(users => res.status(200).json({
      data: users,
    }))
    .catch(err => res.status(500).send(err));
}

export function getUser(req, res) {
  const { userService } = req;

  return userService.fetchUserById(req.params.userId)
    .then(user => UserService.sanitizeUser(user))
    .then(user => res.status(200).json({
      data: user,
    }));
}

export function createUserRequestHandler(config) {
  const app = express();

  app.use(bodyParser.json());

  app.use((req, res, next) => {
    // eslint-disable-next-line no-param-reassign
    req.connection = mysql.createConnection(config.mysql);
    // eslint-disable-next-line no-param-reassign
    req.userService = new UserService({
      connection: req.connection,
    });

    next();
  });

  app.route('/')
    .get(getUsers);

  app.route('/:userId')
    .get(getUser);

  return app;
}
