import { characterCreatorActions } from '../actions/action-types';

const {
  updateAlignmentType,
  updateBackgroundType,
  updateNameType,
  updateRaceType,
} = characterCreatorActions;

const DEFAULT_CHARACTER_CREATOR_STATE = {
  overview: {
    alignment: null,
    background: '',
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

    case updateBackgroundType:
      return {
        ...state,
        overview: {
          ...state.overview,
          background: action.background,
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
