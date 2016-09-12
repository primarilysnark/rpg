import { Alignment, prettifyAlignment } from '../models';
import { sendBadRequest, sendNotFound } from './util';

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

  return new Alignment({
    description: req.body.description,
    name: req.body.name,
    tagline: req.body.tagline,
  })
    .save()
    .then(alignment => res.status(201).json({
      data: prettifyAlignment(alignment),
    }))
    .catch(err => sendBadRequest(res, err));
}

export function getAlignment(req, res) {
  if (req.params.alignmentId == null) {
    return sendBadRequest(res);
  }

  return Alignment.findById(req.params.alignmentId)
    .then(alignment => {
      if (alignment == null) {
        return sendNotFound(res);
      }

      return res.status(200).json({
        data: prettifyAlignment(alignment),
      });
    })
    .catch(() => sendNotFound(res));
}

export function getAlignments(req, res) {
  if (req.query.search != null && typeof req.query.search !== 'string') {
    return sendBadRequest(res, 'Search must be a string');
  }

  return Alignment.find({
    name: new RegExp(`^${req.query.search || ''}.*`, 'i'),
  })
    .then(alignments => res.status(200).json({
      data: alignments.map(prettifyAlignment),
    }))
    .catch(err => res.status(500).send(err));
}

export function deleteAlignment(req, res) {
  if (req.params.alignmentId == null) {
    return sendBadRequest(res);
  }

  return Alignment.findById(req.params.alignmentId)
    .then(alignment => {
      if (alignment == null) {
        return sendNotFound(res);
      }

      return Alignment.where({ _id: req.params.alignmentId })
        .remove();
    })
    .then(() => res.status(204).send())
    .catch(() => sendNotFound(res));
}
