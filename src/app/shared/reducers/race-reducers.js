import { raceActions } from '../actions/action-types';

const {
  fetchRacesTypes,
} = raceActions;

const DEFAULT_CAMPAIGN_STATE = {
  isSearching: false,
  results: {},
};

export function races(state = DEFAULT_CAMPAIGN_STATE, action) {
  const { type, result } = action;

  switch (type) {
    case fetchRacesTypes.processing:
      return {
        ...state,
        isSearching: true,
        results: {},
      };

    case fetchRacesTypes.success:
      return {
        ...state,
        isSearching: false,
        results: result.data.reduce((results, race) => ({
          ...results,
          [race.id]: race,
        }), {}),
      };

    default:
      return state;
  }
}
