import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import { activate } from '../shared/activator';
import { configureStore } from '../shared/configure-store';
import { getViewRoot } from '../shared/root';
import { routes } from '../shared/routes';
import * as clients from './http';

const store = configureStore(window.__INITIAL_STATE__ || {}, clients);

function handleRouterUpdate() {
  const state = this.state;

  activate(state, [
    store,
    state,
    this.history.push,
  ]);
}


const view = (
  <Router
    routes={routes}
    history={createBrowserHistory()}
    onUpdate={handleRouterUpdate}
  />
);

render(getViewRoot(view, store), document.getElementById('app'));
