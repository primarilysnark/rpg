import React, { Component, PropTypes } from 'react';

import './styles.less';

export class LabelledAutoCompleteInput extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    size: PropTypes.number,
    suggestions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
    })),
    suggestionTemplate: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  };

  static defaultPropTypes = {
    size: 1,
  };

  render() {
    return (
      <div className={`labelled-auto-complete-input ${this.props.size !== 1 ? `labelled-auto-complete-input--${this.props.size}` : ''}`}>
        <label className="labelled-auto-complete-input__label" data-label={this.props.label}>
          <input
            className="labelled-auto-complete-input__label__input"
            name={this.props.label}
            onChange={this.props.onChange}
            type="text"
            value={this.props.value}
          />
          {this.props.suggestions == null || this.props.suggestions.length === 0 ? null : (
            <ul className="labelled-auto-complete-input__label__suggestions">
              {this.props.suggestions.map(suggestion => (
                <li className="labelled-auto-complete-input__label__suggestions__option" key={suggestion.id}>
                  {this.props.suggestionTemplate(suggestion)}
                </li>
              ))}
            </ul>
          )}
        </label>
      </div>
    );
  }
}
