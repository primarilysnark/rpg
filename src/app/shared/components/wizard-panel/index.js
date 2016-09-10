import React, { PropTypes } from 'react';

import './styles.less';

export const WizardPanel = (props) => (
  <div className="wizard-panel">
    {props.children}
  </div>
);

WizardPanel.propTypes = {
  children: PropTypes.node.isRequired,
};
