import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';

import { activate } from '../shared/activator';
import { configureStore } from '../shared/configure-store';
import { getViewRoot } from '../shared/root';
import { routes } from '../shared/routes';
import * as clients from './http';

import './styles/common.less';

const store = configureStore(window.__INITIAL_STATE__ || {}, clients);

function handleRouterUpdate() {
  const state = this.state;

  activate(state, [
    store,
    state,
    this.router.push,
  ]);
}


const view = (
  <Router
    routes={routes}
    history={browserHistory}
    onUpdate={handleRouterUpdate}
  />
);

render(getViewRoot(view, store), document.getElementById('app'));
