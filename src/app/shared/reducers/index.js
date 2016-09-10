import { combineReducers } from 'redux';
import * as campaignReducers from './campaign-reducers';
import * as editorReducers from './editor-reducers';
import * as userReducers from './user-reducers';

export const rootReducer = combineReducers({
  ...campaignReducers,
  ...editorReducers,
  ...userReducers,
});
