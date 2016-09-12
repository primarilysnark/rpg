import { alignmentActions } from './action-types';
import { fetchJson } from './util';

const {
  fetchAlignmentsTypes,
} = alignmentActions;

export function fetchAlignments() {
  return {
    types: fetchAlignmentsTypes,
    promise: fetchJson('/api/alignments'),
  };
}
