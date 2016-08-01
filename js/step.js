import React from 'react';

/**
 * Renders a step in the wizard process
 *
 * @param {Object} props The props used for rendering the steps.
 * @returns {JSX}
 * @constructor
 */
const Step = ( props ) => {

	return (
		<h1>Step: {props.title}</h1>
	);

};

Step.propTypes = {
	id: React.PropTypes.string,
	title: React.PropTypes.string.isRequired,
	fields: React.PropTypes.array
};

Step.defaultProps = {
	id: '',
	title: '',
	fields: []
};

export default Step
