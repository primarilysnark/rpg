import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { rootReducer } from './reducers';

export function configureStore(initialState, middlewareApi, storeConfig = []) {
  const createStoreWithMiddleware = compose(
    applyMiddleware(
      thunkMiddleware
    ),
    ...storeConfig
  )(createStore);

  return createStoreWithMiddleware(rootReducer, initialState);
}
