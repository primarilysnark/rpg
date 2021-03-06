import React from 'react';

import { TwentySidedDieIcon } from '../../components/icons/common-icons.g';

import './styles.less';

export const Home = () => (
  <div className="splash-page">
    <div className="splash-page__logo">
      <TwentySidedDieIcon />
    </div>
    <div className="splash-page__actions">
      <a className="splash-page__actions__login" href="/auth/google">Sign in with Google+</a>
    </div>
  </div>
);
