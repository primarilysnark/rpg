import { raceActions } from './action-types';
import { fetchJson } from './util';

const {
  fetchRacesTypes,
} = raceActions;

export function fetchRaces() {
  return {
    types: fetchRacesTypes,
    promise: fetchJson('/api/races'),
  };
}
