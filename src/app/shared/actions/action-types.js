function createAsyncActionTypes(processing, success = `${processing}_SUCCESS`, error = `${processing}_ERROR`) {
  return { processing, success, error };
}

// Campaign types
export const campaignActions = {
  fetchCampaignsTypes: createAsyncActionTypes('CAMPAIGNS/FETCH_CAMPAIGNS'),
};
