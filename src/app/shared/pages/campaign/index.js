import React, { Component } from 'react';
import { connect } from 'react-redux';

import { requireAuthenticatedUser } from '../../activators/auth-activators';

function mapStateToProps({ currentUser }) {
  return { currentUser };
}

@connect(mapStateToProps)
export class Campaign extends Component {
  static activate(store, routerState, navigate) {
    return requireAuthenticatedUser(store, routerState, navigate);
  }

  render() {
    return (
      <div>Campaign page</div>
    );
  }
}
