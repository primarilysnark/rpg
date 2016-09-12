import React, { Component, PropTypes } from 'react';

import './styles.less';

export class LabelledInput extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    size: PropTypes.number,
    value: PropTypes.string.isRequired,
  };

  static defaultPropTypes = {
    size: 1,
  };

  render() {
    return (
      <div className={`labelled-input labelled-input--${this.props.size}`}>
        <label className="labelled-input__label" data-label={this.props.label}>
          <input
            className="labelled-input__label__input"
            name={this.props.label}
            onChange={this.props.onChange}
            type="text"
            value={this.props.value}
          />
        </label>
      </div>
    );
  }
}
