import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import { requireAuthenticatedUser } from '../../activators/auth-activators';
import { fetchCampaigns } from '../../actions';

function mapStateToProps({ campaigns, currentUser }) {
  return { campaigns, currentUser };
}

@connect(mapStateToProps)
export class Campaigns extends Component {
  static propTypes = {
    campaigns: PropTypes.shape({
      campaigns: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
  };

  static activate(store, routerState, navigate) {
    return requireAuthenticatedUser(store, routerState, navigate)
      .then(() => Promise.all([
        store.dispatch(fetchCampaigns()),
      ]));
  }

  render() {
    return (
      <div>
        <Helmet title="Campaigns" />
        <div>Campaigns</div>
        <ul>
          {this.props.campaigns.campaigns.map(campaign => (
            <li key={campaign.id}>{campaign.name}</li>
          ))}
        </ul>
      </div>
    );
  }
}
