import React from 'react';
import { IndexRoute, Route } from 'react-router';

import { App } from './pages/app';
import { Campaign } from './pages/campaign';
import { Home } from './pages/home';

export const routes = (
  <Route component={App} path="/">
    <IndexRoute component={Home} />
    <Route component={Campaign} path="/campaigns" />
  </Route>
);
