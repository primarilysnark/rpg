import React from 'react';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';

export function getViewRoot(view, store) {
  return (
    <div>
      <Helmet titleTemplate="%s - RPG" />
      <Provider store={store}>
        {view}
      </Provider>
    </div>
  );
}
