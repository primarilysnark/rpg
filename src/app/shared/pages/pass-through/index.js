import { PropTypes } from 'react';

export const PassThrough = (props) => props.children;

PassThrough.propTypes = {
  children: PropTypes.node.isRequired,
};
