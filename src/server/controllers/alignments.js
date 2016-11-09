import { sendBadRequest, sendNotFound } from './util';
import {
  deleteAlignmentById,
  fetchAlignmentById,
  fetchAlignments,
  saveAlignment,
} from '../models';

export function createAlignment(req, res) {
  if (req.body.description == null) {
    return sendBadRequest(res, 'Alignments must have a description.');
  }

  if (req.body.name == null) {
    return sendBadRequest(res, 'Alignments must have a name.');
  }

  if (req.body.tagline == null) {
    return sendBadRequest(res, 'Alignments must have a tagline.');
  }

  return saveAlignment(req.connection, {
    description: req.body.description,
    name: req.body.name,
    tagline: req.body.tagline,
  })
    .then(alignment => res.status(201).json({
      data: alignment,
    }))
    .catch(err => sendBadRequest(res, err));
}

export function getAlignment(req, res) {
  if (req.params.alignmentId == null) {
    return res.status(400).send();
  }

  const alignmentId = parseInt(req.params.alignmentId, 10);
  if (isNaN(alignmentId)) {
    if (req.params.alignmentId == null) {
      return res.status(404).send();
    }
  }

  return fetchAlignmentById(req.connection, alignmentId)
    .then(alignment => {
      if (alignment == null) {
        return sendNotFound(res);
      }

      return res.status(200).json({
        data: alignment,
      });
    })
    .catch(() => sendNotFound(res));
}

export function getAlignments(req, res) {
  return fetchAlignments(req.connection)
    .then(alignments => res.status(200).json({
      data: alignments,
    }))
    .catch(err => res.status(500).send(err));
}

export function deleteAlignment(req, res) {
  if (req.params.alignmentId == null) {
    return res.status(400).send();
  }

  const alignmentId = parseInt(req.params.alignmentId, 10);
  if (isNaN(alignmentId)) {
    if (req.params.alignmentId == null) {
      return res.status(404).send();
    }
  }

  return fetchAlignmentById(req.connection, alignmentId)
    .then(alignment => {
      if (alignment == null) {
        return res.status(404).send();
      }

      return deleteAlignmentById(req.connection, alignment.id);
    })
    .then(() => res.status(204).send())
    .catch(err => res.status(404).send(err));
}
