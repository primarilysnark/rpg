import React from 'react';
import { IndexRoute, Route } from 'react-router';

import { App } from './pages/app';
import { Campaigns } from './pages/campaigns';
import { Characters } from './pages/characters';
import { CreateCharacter } from './pages/create-character';
import { CreateCharacterOverview } from './pages/create-character-overview';
import { PassThrough } from './pages/pass-through';

export const routes = (
  <Route component={App} path="/">
    <Route component={Campaigns} path="/campaigns" />
    <Route component={PassThrough} path="/characters">
      <IndexRoute component={Characters} />
      <Route component={CreateCharacter} path="/characters/create">
        <IndexRoute component={CreateCharacterOverview} />
      </Route>
    </Route>
  </Route>
);
