function createAsyncActionTypes(processing, success = `${processing}_SUCCESS`, error = `${processing}_ERROR`) {
  return { processing, success, error };
}

// Alignment types
export const alignmentActions = {
  fetchAlignmentsTypes: createAsyncActionTypes('ALIGNMENT/SEARCH_ALIGNMENTS'),
};


// Campaign types
export const campaignActions = {
  fetchCampaignsTypes: createAsyncActionTypes('CAMPAIGNS/FETCH_CAMPAIGNS'),
};

// Character creator types
export const characterCreatorActions = {
  updateAlignmentType: 'CHARACTER_CREATOR/UPDATE_ALIGNMENT',
  updateNameType: 'CHARACTER_CREATOR/UPDATE_NAME',
  updateRaceType: 'CHARACTER_CREATOR/UPDATE_RACE',
};

// Race types
export const raceActions = {
  fetchRacesTypes: createAsyncActionTypes('RACE/SEARCH_RACES'),
};
