/* eslint new-cap: 0 */
import mongoose from 'mongoose';

export const User = mongoose.model('User', mongoose.Schema({
  google: {
    id: String,
    token: String,
    refreshToken: String,
    expireTime: Number,
  },
}));

export function prettifyUser(user, googleUser) {
  return {
    id: user._id.toString(),
    avatarUrl: googleUser.photos != null ? googleUser.photos[0].url : null,
    email: googleUser.emailAddresses != null ? googleUser.emailAddresses[0].value : null,
    name: googleUser.names[0].displayName,
  };
}
