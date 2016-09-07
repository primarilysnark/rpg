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
    avatarUrl: googleUser.image.url,
    email: googleUser.emails[0].value,
    name: googleUser.displayName,
    nickname: googleUser.nickname,
  };
}
