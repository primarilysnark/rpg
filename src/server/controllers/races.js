import { Race, prettifyRace } from '../models';
import { sendBadRequest, sendNotFound } from './util';

export function createRace(req, res) {
  if (req.body.name == null) {
    return sendBadRequest(res, 'Races must have a name');
  }

  if (typeof req.body.name !== 'string') {
    return sendBadRequest(res, 'Race names must be strings');
  }

  if (req.body.description == null) {
    return sendBadRequest(res, 'Races must have a description');
  }

  return new Race({
    name: req.body.name,
    description: req.body.description,
  })
    .save()
    .then(race => res.status(201).json({
      data: prettifyRace(race),
    }))
    .catch(err => sendBadRequest(res, err));
}

export function getRace(req, res) {
  if (req.params.raceId == null) {
    return sendBadRequest(res);
  }

  return Race.findById(req.params.raceId)
    .then(race => {
      if (race == null) {
        return sendNotFound(res);
      }

      return res.status(200).json({
        data: prettifyRace(race),
      });
    })
    .catch(() => sendNotFound(res));
}

export function getRaces(req, res) {
  if (req.query.search != null && typeof req.query.search !== 'string') {
    return sendBadRequest(res, 'Search must be a string');
  }

  return Race.find({
    name: new RegExp(`^${req.query.search || ''}.*`, 'i'),
  })
    .then(races => res.status(200).json({
      data: races.map(prettifyRace),
    }))
    .catch(err => res.status(500).send(err));
}

export function deleteRace(req, res) {
  if (req.params.raceId == null) {
    return sendBadRequest(res);
  }

  return Race.findById(req.params.raceId)
    .then(campaign => {
      if (campaign == null) {
        return sendNotFound(res);
      }

      return Race.where({ _id: req.params.raceId })
        .remove();
    })
    .then(() => res.status(204).send())
    .catch(() => sendNotFound(res));
}
