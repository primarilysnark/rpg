import {
  fetchUserById,
  fetchUsers,
  sanitizeUser,
} from '../models';

export function getUsers(req, res) {
  return fetchUsers(req.connection)
    .then(users => users.map(user => sanitizeUser(user)))
    .then(users => res.status(200).json({
      data: users,
    }))
    .catch(err => res.status(500).send(err));
}

export function getUser(req, res) {
  return fetchUserById(req.connection, req.params.userId)
    .then(user => sanitizeUser(user))
    .then(user => res.status(200).json({
      data: user,
    }));
}
