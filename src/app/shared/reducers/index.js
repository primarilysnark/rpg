import { combineReducers } from 'redux';
import * as campaignReducers from './campaign-reducers';
import * as characterCreatorReducers from './character-creator-reducers';
import * as userReducers from './user-reducers';

export const rootReducer = combineReducers({
  ...campaignReducers,
  ...characterCreatorReducers,
  ...userReducers,
});
