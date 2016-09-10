import React, { Component, PropTypes } from 'react';

import './styles.less';

export class InformationPanel extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    heading: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    size: PropTypes.number,
  };

  static defaultPropTypes = {
    size: 1,
  };

  render() {
    return (
      <div className={`information-panel ${this.props.size !== 1 ? `information-panel--${this.props.size}` : ''}`}>
        <table className="information-panel__table">
          <tbody>
            <tr>
              <td className="information-panel__table__heading" data-label={this.props.label}>{this.props.heading}</td>
            </tr>
            <tr>
              <td className="information-panel__table__description">{this.props.children}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
