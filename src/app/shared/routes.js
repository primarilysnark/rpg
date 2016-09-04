import React from 'react';
import { Route } from 'react-router';

import { App } from './pages/app';
import { Campaign } from './pages/campaign';

export const routes = (
  <Route component={App} path="/">
    <Route component={Campaign} path="/campaigns" />
  </Route>
);
