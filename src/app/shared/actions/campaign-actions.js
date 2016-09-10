import { campaignActions } from './action-types';
import { fetchJson } from './util';

const {
  fetchCampaignsTypes,
} = campaignActions;

export function fetchCampaigns() {
  return {
    types: fetchCampaignsTypes,
    promise: fetchJson('/api/campaigns'),
  };
}
