/* eslint new-cap: 0 */
import mongoose from 'mongoose';

export const Alignment = mongoose.model('Alignment', mongoose.Schema({
  description: {
    type: [String],
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  tagline: {
    type: String,
    required: true,
  },
}));

export function prettifyAlignment(alignment) {
  return {
    id: alignment._id.toString(),
    name: alignment.name,
    description: alignment.description,
    tagline: alignment.tagline,
  };
}
