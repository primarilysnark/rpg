import { combineReducers } from 'redux';
import * as editorReducers from './editor-reducers';
import * as userReducers from './user-reducers';

export const rootReducer = combineReducers({
  ...editorReducers,
  ...userReducers,
});
