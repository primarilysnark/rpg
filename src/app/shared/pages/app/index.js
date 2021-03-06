import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { Home } from '../../pages/home';
import { TwentySidedDieIcon } from '../../components/icons/common-icons.g';

import './styles.less';

const ROUTE_NAMES = {
  '/campaigns': 'Campaigns',
  '/characters': 'Characters',
  '/characters/create': 'Create a Character',
};

function mapStateToProps({ currentUser }) {
  return { currentUser };
}

@connect(mapStateToProps)
export class App extends Component {
  static propTypes = {
    children: PropTypes.node,
    currentUser: PropTypes.shape({
      attributes: PropTypes.shape({
        avatarUrl: PropTypes.string,
        email: PropTypes.string,
        name: PropTypes.string,
      }).isRequired,
      id: PropTypes.number.isRequired,
    }).isRequired,
    routes: PropTypes.arrayOf(PropTypes.shape({
      path: PropTypes.string,
    })).isRequired,
  };

  state = {
    isUserMenuOpen: false,
  };

  toggleUserMenu = () => this.setState({ isUserMenuOpen: !this.state.isUserMenuOpen });

  render() {
    if (this.props.currentUser.id === -1) {
      return (
        <Home />
      );
    }

    return (
      <div className="app">
        <header className="app__header">
          <nav className="app__header__nav">
            <Link className="app__header__nav__home" to="/">
              <TwentySidedDieIcon />
            </Link>
            <Link className="app__header__nav__create" to="/characters/create">Create a Character</Link>
            <ul className="app__header__nav__options">
              <li className="app__header__nav__options__link">
                <Link activeClassName="app__header__nav__options__link__anchor--active" className="app__header__nav__options__link__anchor" to="/campaigns">Campaigns</Link>
              </li>
              <li className="app__header__nav__options__link">
                <Link activeClassName="app__header__nav__options__link__anchor--active" className="app__header__nav__options__link__anchor" to="/characters">Characters</Link>
              </li>
            </ul>
          </nav>
        </header>
        <div className="app__content">
          <nav className="app__content__navigation">
            <ul className="app__content__navigation__breadcrumbs">
              {this.props.routes.filter(route => route.path != null && route.path !== '/').map(route => (
                <li className="app__content__navigation__breadcrumbs__option" key={route.path}>{ROUTE_NAMES[route.path]}</li>
              ))}
            </ul>
            <div className="app__content__navigation__user">
              <div className="app__content__navigation__user__info user-info">
                <button className="user-info__avatar" onClick={this.toggleUserMenu} style={{ backgroundImage: `url('${this.props.currentUser.attributes.avatarUrl}')` }} />
                <div className={`user-info__menu ${this.state.isUserMenuOpen ? 'user-info__menu--open' : ''}`}>
                  <div className="user-info__menu__details">
                    <img className="user-info__menu__details__avatar" role="presentation" src={this.props.currentUser.attributes.avatarUrl} />
                    <div className="user-info__menu__details__content">
                      <div className="user-info__menu__details__content__name">{this.props.currentUser.attributes.name}</div>
                      <div className="user-info__menu__details__content__email">{this.props.currentUser.attributes.email}</div>
                    </div>
                  </div>
                  <div className="user-info__menu__actions">
                    <form method="POST" action="/signout">
                      <input type="submit" className="user-info__menu__actions__sign-out-link" value="Sign out" />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <div className="app__content__page">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
