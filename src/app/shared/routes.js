import React from 'react';
import { Route } from 'react-router';

import { App } from './pages/app';
import { Campaigns } from './pages/campaigns';
import { Characters } from './pages/characters';

export const routes = (
  <Route component={App} path="/">
    <Route component={Campaigns} path="/campaigns" />
    <Route component={Characters} path="/characters" />
  </Route>
);
