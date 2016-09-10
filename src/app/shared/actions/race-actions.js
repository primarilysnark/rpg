import { raceActions } from './action-types';
import { fetchJson } from './util';

const {
  clearRacesType,
  searchRacesTypes,
} = raceActions;

export function clearRaces() {
  return {
    type: clearRacesType,
  };
}

export function searchRaces(search) {
  return {
    types: searchRacesTypes,
    promise: fetchJson(`/api/races?search=${search}`),
  };
}
