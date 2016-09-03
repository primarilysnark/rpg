import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

function mapStateToProps({ currentUser }) {
  return { currentUser };
}

@connect(mapStateToProps)
export class App extends Component {
  static propTypes = {
    children: PropTypes.node,
    currentUser: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
  };

  render() {
    return (
      <div className="app">
        <div className="app__content">
          {this.props.currentUser.name}
          {this.props.children}
        </div>
      </div>
    );
  }
}
