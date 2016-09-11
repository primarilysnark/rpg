/* eslint new-cap: 0 */
import mongoose from 'mongoose';

export const Race = mongoose.model('Race', mongoose.Schema({
  alignment: {
    type: [String],
    required: true,
  },
  description: {
    type: [String],
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  physicalDescription: {
    type: [String],
    required: true,
  },
  relations: {
    type: [String],
    required: true,
  },
  society: {
    type: [String],
    required: true,
  },
  tagline: {
    type: String,
    required: true,
  },
}));

export function prettifyRace(race) {
  return {
    id: race._id.toString(),
    alignment: race.alignment,
    description: race.description,
    name: race.name,
    physicalDescription: race.physicalDescription,
    relations: race.relations,
    society: race.society,
    tagline: race.tagline,
  };
}
