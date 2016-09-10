import { raceActions } from '../actions/action-types';

const {
  clearRacesType,
  searchRacesTypes,
} = raceActions;

const DEFAULT_CAMPAIGN_STATE = {
  isSearching: false,
  results: null,
};

export function races(state = DEFAULT_CAMPAIGN_STATE, action) {
  const { type, result } = action;

  switch (type) {
    case clearRacesType:
      return {
        ...state,
        results: null,
      };

    case searchRacesTypes.processing:
      return {
        ...state,
        isSearching: true,
        results: null,
      };

    case searchRacesTypes.success:
      return {
        ...state,
        isSearching: false,
        results: result.data,
      };

    default:
      return state;
  }
}
