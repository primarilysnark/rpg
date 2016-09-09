import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { Home } from '../../pages/home';
import { TwentySidedDieIcon } from '../../components/icons/common-icons.g';

import './styles.less';

function mapStateToProps({ currentUser }) {
  return { currentUser };
}

@connect(mapStateToProps)
export class App extends Component {
  static propTypes = {
    children: PropTypes.node,
    currentUser: PropTypes.shape({
      avatarUrl: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
    }).isRequired,
  };

  state = {
    isUserMenuOpen: false,
  };

  toggleUserMenu = () => this.setState({ isUserMenuOpen: !this.state.isUserMenuOpen });

  render() {
    if (this.props.currentUser.id === '-1') {
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
            <Link className="app__header__nav__create" to="/campaigns">Create a Character</Link>
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
              <li className="app__content__navigation__breadcrumbs__option">Characters</li>
              <li className="app__content__navigation__breadcrumbs__option">Create a Character</li>
            </ul>
            <div className="app__content__navigation__user">
              <div className="app__content__navigation__user__info user-info">
                <button className="user-info__avatar" onClick={this.toggleUserMenu} style={{ backgroundImage: `url('${this.props.currentUser.avatarUrl}')` }} />
                <div className={`user-info__menu ${this.state.isUserMenuOpen ? 'user-info__menu--open' : ''}`}>
                  <div className="user-info__menu__details">
                    <img className="user-info__menu__details__avatar" role="presentation" src={this.props.currentUser.avatarUrl} />
                    <div className="user-info__menu__details__content">
                      <div className="user-info__menu__details__content__name">{this.props.currentUser.name}</div>
                      <div className="user-info__menu__details__content__email">{this.props.currentUser.email}</div>
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
