import React from "react";
import PropTypes from "prop-types";

/**
 * Renders a progress indicator for the wizard based on the total number of steps and the current step number.
 *
 * @param {{totalSteps: Number, currentStepNumber: (int|string)}} props
 * Should contain the total number of steps and the current step number.
 *
 * @returns {JSX} A ProgressIndicator component.
 */
const ProgressIndicator = ( props ) => {
	if ( props.currentStepNumber === 0 ) {
		return (
			<p>Unknown step progress</p>
		);
	}

	if ( props.totalSteps < props.currentStepNumber ) {
		return <p>Step { props.currentStepNumber }</p>;
	}

	return (
		<p>Step { props.currentStepNumber } of { props.totalSteps }</p>
	);
};

ProgressIndicator.propTypes = {
	currentStepNumber: PropTypes.number.isRequired,
	totalSteps: PropTypes.number.isRequired,
};

ProgressIndicator.defaultProps = {
};

export default ProgressIndicator;
