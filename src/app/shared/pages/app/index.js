import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

function mapStateToProps({ currentUser }) {
  return { currentUser };
}

@connect(mapStateToProps)
export class App extends Component {
  static propTypes = {
    children: PropTypes.node,
    currentUser: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
    }).isRequired,
  };

  render() {
    return (
      <div className="app">
        <header className="app__header">
          <nav className="app__header__nav">
            <Link to="/">
              <span className="app__header__nav__text">Archmage</span>
            </Link>
          </nav>
          <div className="app__header__user">
            {this.props.currentUser.id === '-1' ? (
              <a className="app__header__user__sign-in-link" href="/auth/google">Sign in</a>
            ) : (
              <div className="app__header__user__info">
                <span className="app__header__user__info__name">{this.props.currentUser.name}</span>
                <form method="POST" action="/signout">
                  <input type="submit" className="app__header__user__info__sign-out-link" value="Sign out" />
                </form>
              </div>
            )}
          </div>
        </header>
        <div className="app__content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
