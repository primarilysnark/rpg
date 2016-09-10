import { campaignActions } from '../actions/action-types';

const {
  fetchCampaignsTypes,
} = campaignActions;

const DEFAULT_CAMPAIGN_STATE = {
  campaigns: [],
};

export function campaigns(state = DEFAULT_CAMPAIGN_STATE, action) {
  const { type, result } = action;

  switch (type) {
    case fetchCampaignsTypes.success:
      return {
        ...state,
        campaigns: result.data,
      };

    default:
      return state;
  }
}
