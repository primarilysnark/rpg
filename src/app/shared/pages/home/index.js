import React, { Component } from 'react';
import { connect } from 'react-redux';

import { requireAnonymousUser } from '../../activators/auth-activators';

function mapStateToProps({ currentUser }) {
  return { currentUser };
}

@connect(mapStateToProps)
export class Home extends Component {
  static activate(store, routerState, navigate) {
    return requireAnonymousUser(store, routerState, navigate);
  }

  render() {
    return (
      <div>Home page</div>
    );
  }
}
