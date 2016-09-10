import React, { Component } from 'react';

import { LabelledInput } from '../../components/labelled-input';
import { InformationPanel } from '../../components/information-panel';
import { WizardPanel } from '../../components/wizard-panel';

import './styles.less';

export class CreateCharacterOverview extends Component {
  state = {

  };

  render() {
    return (
      <div className="character-creator">
        <WizardPanel>
          <LabelledInput label="Name" size={2} value="" />
          <LabelledInput label="Race" size={1} value="Orc" />
          <LabelledInput label="Background" size={1} value="Entertainer" />
          <LabelledInput label="Alignment" size={1} value="Lawful Neutral" />
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
