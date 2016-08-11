/* eslint new-cap: 0 */
import mongoose from 'mongoose';

export default mongoose.model('User', mongoose.Schema({
  google: {
    id: String,
    token: String,
    refreshToken: String,
  },
}));
