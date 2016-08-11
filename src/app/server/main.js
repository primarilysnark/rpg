import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';

import { Html } from './html';
import { activate } from '../shared/activator';
import { configureStore } from '../shared/configure-store';
import { getViewRoot } from '../shared/root';
import { routes } from '../shared/routes';

const isDebug = !!process.env.DEVTOOLS;

export function createAppRequestHandler() {
  return function handleAppRequest(request, response) {
    const store = configureStore(request.store || {}, request.clients);

    function render(status, renderToProps) {
      const content = renderToString(
        <Html isDebug={isDebug} store={store}>
          {getViewRoot((<RouterContext {...renderToProps} />), store, isDebug)}
        </Html>
      );

      response.status(status).send(`<!doctype html>${content}`);
    }

    match({ routes, location: request.url }, (routingError, redirectLocation, renderProps) => {
      if (routingError) {
        console.error(routingError.stack || routingError);
        render(500);
      } else if (redirectLocation) {
        response.redirect(402, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        let replacementState;
        renderProps.router.listen((state, routerState) => {
          replacementState = routerState;
        });
        replacementState = null;

        activate(renderProps, [store, renderProps, renderProps.router.push])
          .then(() => {
            if (replacementState && (replacementState.location.pathname !== renderProps.location.pathname || replacementState.location.search !== renderProps.location.search)) {
              response.redirect(302, replacementState.location.pathname + replacementState.location.search);
            } else {
              render(200, renderProps);
            }
          })
          .catch(error => {
            console.error(error.stack || error);
            return render(500);
          })
          .catch(error => {
            console.error(`Error: ${error.stack}`);
            response.status(500).send('Error');
          });
      } else {
        response.status(404).send('Not found');
      }
    });
  };
}
