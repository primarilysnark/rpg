import { alignmentActions } from '../actions/action-types';

const {
  fetchAlignmentsTypes,
} = alignmentActions;

const DEFAULT_ALIGNMENT_STATE = {
  isSearching: false,
  results: {},
};

export function alignments(state = DEFAULT_ALIGNMENT_STATE, action) {
  const { type, result } = action;

  switch (type) {
    case fetchAlignmentsTypes.processing:
      return {
        ...state,
        isSearching: true,
        results: {},
      };

    case fetchAlignmentsTypes.success:
      return {
        ...state,
        isSearching: false,
        results: result.data.reduce((results, alignment) => ({
          ...results,
          [alignment.id]: alignment,
        }), {}),
      };

    default:
      return state;
  }
}
