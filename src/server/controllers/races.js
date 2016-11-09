import { sendBadRequest, sendNotFound } from './util';
import {
  deleteRaceById,
  fetchRaceById,
  fetchRaces,
  saveRace,
} from '../models';

export function createRace(req, res) {
  if (req.body.alignment == null) {
    return sendBadRequest(res, 'Races must have an alignment description.');
  }

  if (req.body.description == null) {
    return sendBadRequest(res, 'Races must have a description.');
  }

  if (req.body.name == null) {
    return sendBadRequest(res, 'Races must have a name.');
  }

  if (req.body.physicalDescription == null) {
    return sendBadRequest(res, 'Races must have a physical description.');
  }

  if (req.body.relations == null) {
    return sendBadRequest(res, 'Races must have relations with other races.');
  }

  if (req.body.society == null) {
    return sendBadRequest(res, 'Races must have a society description.');
  }

  if (req.body.tagline == null) {
    return sendBadRequest(res, 'Races must have a tagline.');
  }

  return saveRace(req.connection, {
    alignment: req.body.alignment,
    description: req.body.description,
    name: req.body.name,
    physicalDescription: req.body.physicalDescription,
    relations: req.body.relations,
    society: req.body.society,
    tagline: req.body.tagline,
  })
    .then(race => res.status(201).json({
      data: race,
    }))
    .catch(err => sendBadRequest(res, err));
}

export function getRace(req, res) {
  if (req.params.raceId == null) {
    return res.status(400).send();
  }

  const raceId = parseInt(req.params.raceId, 10);
  if (isNaN(raceId)) {
    if (req.params.raceId == null) {
      return res.status(404).send();
    }
  }

  return fetchRaceById(req.connection, raceId)
    .then(race => {
      if (race == null) {
        return sendNotFound(res);
      }

      return res.status(200).json({
        data: race,
      });
    })
    .catch(() => sendNotFound(res));
}

export function getRaces(req, res) {
  return fetchRaces(req.connection)
    .then(races => res.status(200).json({
      data: races,
    }))
    .catch(err => res.status(500).send(err));
}

export function deleteRace(req, res) {
  if (req.params.raceId == null) {
    return res.status(400).send();
  }

  const raceId = parseInt(req.params.raceId, 10);
  if (isNaN(raceId)) {
    if (req.params.raceId == null) {
      return res.status(404).send();
    }
  }

  return fetchRaceById(req.connection, raceId)
    .then(race => {
      if (race == null) {
        return sendNotFound(res);
      }

      return deleteRaceById(req.connection, race.id);
    })
    .then(() => res.status(204).send())
    .catch(() => sendNotFound(res));
}
