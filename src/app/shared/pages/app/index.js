import React, { PropTypes } from 'react';

export const App = (props) => (
  <div className="app">
    <header className="app__header">RPG</header>
    <div className="app__content">
      {props.children}
    </div>
  </div>
);

App.propTypes = {
  children: PropTypes.node,
};
