function createAsyncActionTypes(processing, success = `${processing}_SUCCESS`, error = `${processing}_ERROR`) {
  return { processing, success, error };
}

// Campaign types
export const campaignActions = {
  fetchCampaignsTypes: createAsyncActionTypes('CAMPAIGNS/FETCH_CAMPAIGNS'),
};

export const characterCreatorActions = {
  updateAlignmentType: 'CHARACTER_CREATOR/UPDATE_ALIGNMENT',
  updateBackgroundType: 'CHARACTER_CREATOR/UPDATE_BACKGROUND',
  updateNameType: 'CHARACTER_CREATOR/UPDATE_NAME',
  updateRaceType: 'CHARACTER_CREATOR/UPDATE_RACE',
};

export const raceActions = {
  fetchRacesTypes: createAsyncActionTypes('RACE/SEARCH_RACES'),
};
