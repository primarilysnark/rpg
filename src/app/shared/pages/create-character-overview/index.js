import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { LabelledAutoCompleteInput } from '../../components/labelled-auto-complete-input';
import { LabelledInput } from '../../components/labelled-input';
import { InformationPanel } from '../../components/information-panel';
import { WizardPanel } from '../../components/wizard-panel';
import {
  fetchRaces,
  updateAlignment,
  updateBackground,
  updateName,
  updateRace,
} from '../../actions';

import './styles.less';

function mapStateToProps({ characterCreator, races }) {
  return { characterCreator, races };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchRaces: () => dispatch(fetchRaces()),
    updateAlignment: (alignment) => dispatch(updateAlignment(alignment)),
    updateBackground: (background) => dispatch(updateBackground(background)),
    updateName: (name) => dispatch(updateName(name)),
    updateRace: (race) => dispatch(updateRace(race)),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export class CreateCharacterOverview extends Component {
  static propTypes = {
    characterCreator: PropTypes.shape({
      overview: PropTypes.shape({
        alignment: PropTypes.string.isRequired,
        background: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        race: PropTypes.string,
      }).isRequired,
    }).isRequired,
    races: PropTypes.shape({
      results: PropTypes.objectOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
      })),
    }).isRequired,
    fetchRaces: PropTypes.func.isRequired,
    updateAlignment: PropTypes.func.isRequired,
    updateBackground: PropTypes.func.isRequired,
    updateName: PropTypes.func.isRequired,
    updateRace: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.fetchRaces();
  }

  setRace = (race) => this.props.updateRace(race == null ? null : race.id);

  updateAlignment = (event) => this.props.updateAlignment(event.target.value);

  updateBackground = (event) => this.props.updateBackground(event.target.value);

  updateName = (event) => this.props.updateName(event.target.value);

  renderRace = (race) => (
    <button className="character-creator-suggestion character-creator-suggestion--race" onClick={() => this.setRace(race.id)}>
      <span className="character-creator-suggestion__match">{this.props.characterCreator.overview.race}</span>{race.name.slice(this.props.characterCreator.overview.race.length)}
    </button>
  );

  render() {
    const races = Object.keys(this.props.races.results).map(raceKey => this.props.races.results[raceKey]);

    return (
      <div className="character-creator">
        <WizardPanel>
          <LabelledInput
            label="Name"
            onChange={this.updateName}
            size={2}
            value={this.props.characterCreator.overview.name}
          />
          <LabelledAutoCompleteInput
            label="Race"
            onChange={this.setRace}
            size={1}
            suggestions={races}
            suggestionTemplate={this.renderRace}
            value={this.props.characterCreator.overview.race == null ? '' : this.props.races.results[this.props.characterCreator.overview.race].name}
          />
          <LabelledInput
            label="Background"
            onChange={this.updateBackground}
            size={1}
            value={this.props.characterCreator.overview.background}
          />
          <LabelledInput
            label="Alignment"
            onChange={this.updateAlignment}
            size={1}
            value={this.props.characterCreator.overview.alignment}
          />
        </WizardPanel>
        <WizardPanel>
          {this.props.characterCreator.overview.race == null ? null : (
            <InformationPanel heading={this.props.races.results[this.props.characterCreator.overview.race].name} label="Your race" size={2}>
              <p>{this.props.races.results[this.props.characterCreator.overview.race].tagline}</p>
            </InformationPanel>
          )}
          <InformationPanel heading="Entertainer" label="Your background">
            <p>You thrive in front of an audience. You know how to entrance, entertain, and even inspire them.</p>
          </InformationPanel>
          <InformationPanel heading="Lawful Neutral" label="Your alignment">
            <p>You act as the law, tradition, or personal code direct you. Order and organization are paramount.</p>
          </InformationPanel>
        </WizardPanel>
      </div>
    );
  }
}
