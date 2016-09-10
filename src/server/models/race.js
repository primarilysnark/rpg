/* eslint new-cap: 0 */
import mongoose from 'mongoose';

export const Race = mongoose.model('Race', mongoose.Schema({
  description: {
    type: [String],
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
}));

export function prettifyRace(race) {
  return {
    id: race._id.toString(),
    description: race.description,
    name: race.name,
  };
}
