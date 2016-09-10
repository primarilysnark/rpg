import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';

import { Wizard } from '../../components/wizard';

const STEPS = [
  {
    label: 'Overview',
    href: 'overview',
  },
  {
    label: 'Ability Scores',
    href: 'abilityScores',
  },
  {
    label: 'Classes',
    href: 'classes',
  },
  {
    label: 'Combat & Equipment',
    href: 'overview',
  },
  {
    label: 'Review',
    href: 'Review',
  },
];

export const CreateCharacter = (props) => (
  <Wizard steps={STEPS} currentStep={0}>
    <Helmet title="Create Characters" />
    {props.children}
  </Wizard>
);

CreateCharacter.propTypes = {
  children: PropTypes.node.isRequired,
};
