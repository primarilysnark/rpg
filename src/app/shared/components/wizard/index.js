import React, { PropTypes } from 'react';

import './styles.less';

export const Wizard = (props) => (
  <div className="wizard">
    <ol className="wizard__progress-bar">
      {props.steps.map((step, index) =>
        <li className={`wizard__progress-bar__step ${index === props.currentStep ? 'wizard__progress-bar__step--active' : ''}`} key={index}>{step.label}</li>
      )}
    </ol>
    <div className="wizard__content">
      {props.children}
    </div>
  </div>
);

Wizard.propTypes = {
  children: PropTypes.node.isRequired,
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
  })).isRequired,
};
