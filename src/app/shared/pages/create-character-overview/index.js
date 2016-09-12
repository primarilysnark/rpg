import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { LabelledAutoCompleteInput } from '../../components/labelled-auto-complete-input';
import { LabelledInput } from '../../components/labelled-input';
import { InformationPanel } from '../../components/information-panel';
import { WizardPanel } from '../../components/wizard-panel';
import {
  fetchAlignments,
  fetchRaces,
  updateAlignment,
  updateName,
  updateRace,
} from '../../actions';

import './styles.less';

function mapStateToProps({ alignments, characterCreator, races }) {
  return { alignments, characterCreator, races };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAlignments: () => dispatch(fetchAlignments()),
    fetchRaces: () => dispatch(fetchRaces()),
    updateAlignment: (alignment) => dispatch(updateAlignment(alignment)),
    updateName: (name) => dispatch(updateName(name)),
    updateRace: (race) => dispatch(updateRace(race)),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export class CreateCharacterOverview extends Component {
  static propTypes = {
    alignments: PropTypes.shape({
      results: PropTypes.objectOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
      })),
    }).isRequired,
    characterCreator: PropTypes.shape({
      overview: PropTypes.shape({
        alignment: PropTypes.string,
        name: PropTypes.string.isRequired,
        race: PropTypes.string,
      }).isRequired,
    }).isRequired,
    races: PropTypes.shape({
      results: PropTypes.objectOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
      })),
    }).isRequired,
    fetchAlignments: PropTypes.func.isRequired,
    fetchRaces: PropTypes.func.isRequired,
    updateAlignment: PropTypes.func.isRequired,
    updateName: PropTypes.func.isRequired,
    updateRace: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.fetchAlignments();
    this.props.fetchRaces();
  }

  updateAlignment = (alignment) => this.props.updateAlignment(alignment == null ? null : alignment.id);

  updateName = (event) => this.props.updateName(event.target.value);

  updateRace = (race) => this.props.updateRace(race == null ? null : race.id);

  render() {
    const alignments = Object.keys(this.props.alignments.results).map(raceKey => this.props.alignments.results[raceKey]);
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
            onChange={this.updateRace}
            size={1}
            suggestions={races}
            value={this.props.characterCreator.overview.race == null ? '' : this.props.races.results[this.props.characterCreator.overview.race].name}
          />
          <LabelledAutoCompleteInput
            label="Alignment"
            onChange={this.updateAlignment}
            size={1}
            suggestions={alignments}
            value={this.props.characterCreator.overview.alignment == null ? '' : this.props.alignments.results[this.props.characterCreator.overview.alignment].name}
          />
        </WizardPanel>
        <WizardPanel>
          {this.props.characterCreator.overview.race == null ? null : (
            <InformationPanel heading={this.props.races.results[this.props.characterCreator.overview.race].name} label="Your race" size={2}>
              <p>{this.props.races.results[this.props.characterCreator.overview.race].tagline}</p>
            </InformationPanel>
          )}
          {this.props.characterCreator.overview.alignment == null ? null : (
            <InformationPanel heading={this.props.alignments.results[this.props.characterCreator.overview.alignment].name} label="Your alignment" size={1}>
              <p>{this.props.alignments.results[this.props.characterCreator.overview.alignment].tagline}</p>
            </InformationPanel>
          )}
        </WizardPanel>
      </div>
    );
  }
}
