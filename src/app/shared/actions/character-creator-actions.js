import { characterCreatorActions } from './action-types';

const {
  updateAlignmentType,
  updateNameType,
  updateRaceType,
} = characterCreatorActions;

export function updateAlignment(alignment) {
  return {
    type: updateAlignmentType,
    alignment,
  };
}

export function updateName(name) {
  return {
    type: updateNameType,
    name,
  };
}

export function updateRace(race) {
  return {
    type: updateRaceType,
    race,
  };
}
