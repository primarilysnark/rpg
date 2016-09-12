import { combineReducers } from 'redux';
import * as alignmentReducers from './alignment-reducers';
import * as campaignReducers from './campaign-reducers';
import * as characterCreatorReducers from './character-creator-reducers';
import * as raceReducers from './race-reducers';
import * as userReducers from './user-reducers';

export const rootReducer = combineReducers({
  ...alignmentReducers,
  ...campaignReducers,
  ...characterCreatorReducers,
  ...raceReducers,
  ...userReducers,
});
