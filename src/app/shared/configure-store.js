import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { rootReducer } from './reducers';

function createPromiseMiddleware(...callbackArgs) {
  return () => next => action => {
    const { promise, types, ...rest } = action;

    if (!promise) {
      return next(action);
    }

    next({
      ...rest,
      type: types.processing,
    });

    return new Promise(resolve => {
      if (typeof promise === 'function') {
        resolve(promise(...callbackArgs));
      }

      resolve(promise);
    })
      .then(result => next({
        ...rest,
        result,
        type: types.success,
      }), error => next({
        ...rest,
        error,
        type: types.error,
      }));
  };
}

export function configureStore(initialState, middlewareApi, storeConfig = []) {
  const createStoreWithMiddleware = compose(
    applyMiddleware(
      thunkMiddleware,
      createPromiseMiddleware()
    ),
    ...storeConfig
  )(createStore);

  return createStoreWithMiddleware(rootReducer, initialState);
}
