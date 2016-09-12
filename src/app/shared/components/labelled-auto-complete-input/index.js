import React, { Component, PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
import TagsInput from 'react-tagsinput';

import './styles.less';

export class LabelledAutoCompleteInput extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    size: PropTypes.number,
    suggestions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
    })).isRequired,
    value: PropTypes.string.isRequired,
  };

  static defaultPropTypes = {
    size: 2,
  };

  state = {
    suggestions: [],
  };

  componentWillMount() {
    this.setState({
      suggestions: this.props.suggestions,
    });
  }

  componentWillReceiveProps(nextProps) {
    // TODO (Josh): Dedup this call with a suggestion comparison
    this.setState({
      suggestions: nextProps.suggestions,
    });
  }

  onChange = (tags) => {
    if (tags.length === 0) {
      this.props.onChange('');
    } else {
      this.props.onChange(tags[0]);
    }
  };

  renderInput = (props) => {
    if (this.props.value.length !== 0) {
      return null;
    }

    const handleOnChange = (event, { method }) => {
      if (method === 'enter') {
        event.preventDefault();
      } else {
        props.onChange(event);
      }
    };

    const onSuggestionsFetchRequested = ({ value }) => {
      const inputValue = value.toLowerCase();

      this.setState({
        suggestions: this.props.suggestions.filter(suggestion => suggestion.name.toLowerCase().slice(0, inputValue.length) === inputValue),
      });
    };

    return (
      <Autosuggest
        getSuggestionValue={suggestion => suggestion.name}
        inputProps={{
          placeholder: '',
          onChange: handleOnChange,
          value: props.value,
        }}
        onSuggestionSelected={(e, { suggestion }) => props.addTag(suggestion)}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={() => this.setState({ suggestions: [] })}
        renderSuggestion={suggestion => (
          <span><strong>{suggestion.name.slice(0, props.value.length)}</strong>{suggestion.name.slice(props.value.length)}</span>
        )}
        shouldRenderSuggestions={value => value != null && value.length !== 0}
        suggestions={this.state.suggestions}
        ref={props.ref}
      />
    );
  };

  render() {
    return (
      <div className={`labelled-auto-complete-input labelled-auto-complete-input--${this.props.size}`}>
        <label className="labelled-auto-complete-input__label" data-label={this.props.label}>
          <TagsInput
            onChange={this.onChange}
            renderInput={this.renderInput}
            renderLayout={(tagComponents, inputComponent) => (
              <span>
                {this.props.value.length === 0 ? null : (
                  <div className="labelled-auto-complete-input__label__input">
                    {tagComponents}
                  </div>
                )}
                {inputComponent}
              </span>
            )}
            value={this.props.value.length === 0 ? [] : [this.props.value]}
          />
        </label>
      </div>
    );
  }
}
