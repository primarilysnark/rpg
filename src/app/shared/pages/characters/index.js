import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import { requireAuthenticatedUser } from '../../activators/auth-activators';

function mapStateToProps({ currentUser }) {
  return { currentUser };
}

@connect(mapStateToProps)
export class Characters extends Component {
  static activate(store, routerState, navigate) {
    return requireAuthenticatedUser(store, routerState, navigate);
  }

  render() {
    return (
      <div>
        <Helmet title="Characters" />
        <div>Characters page</div>
      </div>
    );
  }
}
