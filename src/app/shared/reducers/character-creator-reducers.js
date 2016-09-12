import { characterCreatorActions } from '../actions/action-types';

const {
  updateAlignmentType,
  updateNameType,
  updateRaceType,
} = characterCreatorActions;

const DEFAULT_CHARACTER_CREATOR_STATE = {
  overview: {
    alignment: null,
    name: '',
    race: null,
  },
};

export function characterCreator(state = DEFAULT_CHARACTER_CREATOR_STATE, action) {
  const { type } = action;

  switch (type) {
    case updateAlignmentType:
      return {
        ...state,
        overview: {
          ...state.overview,
          alignment: action.alignment,
        },
      };

    case updateNameType:
      return {
        ...state,
        overview: {
          ...state.overview,
          name: action.name,
        },
      };

    case updateRaceType:
      return {
        ...state,
        overview: {
          ...state.overview,
          race: action.race,
        },
      };

    default:
      return state;
  }
}
