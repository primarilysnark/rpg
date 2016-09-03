/* eslint new-cap: 0 */
import mongoose from 'mongoose';

export const Campaign = mongoose.model('Campaign', mongoose.Schema({
  name: String,
}));

export function prettifyCampaign(campaign) {
  return {
    id: campaign._id,
    name: campaign.name,
  };
}
