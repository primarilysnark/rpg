import React, { PropTypes } from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';

export const Html = (props) => {
  const content = renderToString(props.children);
  const head = Helmet.rewind();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        {head.meta.toComponent()}
        {head.title.toComponent()}
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700" rel="stylesheet" />
        <link rel="shortcut icon" href="/public/images/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="/dist/style.css" />
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: content }} />
        <script dangerouslySetInnerHTML={{ __html: `var __INITIAL_STATE__ = ${JSON.stringify(props.store.getState())}, __DEBUG__ = ${props.isDebug};` }} />
        <script src="/dist/main.bundle.js" />
      </body>
    </html>
  );
};

Html.propTypes = {
  children: PropTypes.node.isRequired,
  isDebug: PropTypes.bool.isRequired,
  store: PropTypes.object.isRequired,
};
