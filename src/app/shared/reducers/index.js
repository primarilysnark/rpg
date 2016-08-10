import { combineReducers } from 'redux';
import * as editorReducers from './editor-reducers';

export const rootReducer = combineReducers({
  ...editorReducers,
});
