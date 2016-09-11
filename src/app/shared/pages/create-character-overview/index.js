import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { LabelledAutoCompleteInput } from '../../components/labelled-auto-complete-input';
import { LabelledInput } from '../../components/labelled-input';
import { InformationPanel } from '../../components/information-panel';
import { WizardPanel } from '../../components/wizard-panel';
import {
  clearRaces,
  searchRaces,
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
    clearRaces: () => dispatch(clearRaces()),
    searchRaces: (search) => dispatch(searchRaces(search)),
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
        race: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    clearRaces: PropTypes.func.isRequired,
    races: PropTypes.shape({
      results: PropTypes.array,
    }).isRequired,
    searchRaces: PropTypes.func.isRequired,
    updateAlignment: PropTypes.func.isRequired,
    updateBackground: PropTypes.func.isRequired,
    updateName: PropTypes.func.isRequired,
    updateRace: PropTypes.func.isRequired,
  };

  setRace = (race) => {
    this.props.clearRaces();
    this.props.updateRace(race);
  }

  updateAlignment = (event) => this.props.updateAlignment(event.target.value);

  updateBackground = (event) => this.props.updateBackground(event.target.value);

  updateName = (event) => this.props.updateName(event.target.value);

  updateRace = (event) => {
    this.props.updateRace(event.target.value);

    if (event.target.value !== '') {
      this.props.searchRaces(event.target.value);
    } else {
      this.props.clearRaces();
    }
  }

  renderRace = (race) => (
    <button className="character-creator-suggestion character-creator-suggestion--race" onClick={() => this.setRace(race.name)}>
      <span className="character-creator-suggestion__match">{this.props.characterCreator.overview.race}</span>{race.name.slice(this.props.characterCreator.overview.race.length)}
    </button>
  );

  render() {
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
            onChange={this.updateRace}
            size={1}
            suggestions={this.props.races.results}
            suggestionTemplate={this.renderRace}
            value={this.props.characterCreator.overview.race}
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
          <InformationPanel heading="Orc" label="Your race" size={2}>
            <p>Orcs are aggressive, callous, and domineering. Bullies by nature, they respect strength and power as the highest virtues. On an almost instinctive level, orcs believe they are entitled to anything they want unless someone stronger can stop them from seizing it.</p>
          </InformationPanel>
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
