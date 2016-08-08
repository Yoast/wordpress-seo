import React from "react";

/**
 * Renders a progress indicator for the wizard based on the total number of steps and the current step number.
 *
 * @param {{totalSteps: Number, currentStepNumber: (int|string)}} props
 * Should contain the total number of steps and the current step number.
 *
 * @return {JSX}
 */
const ProgressIndicator = ( props ) => {

	if ( props.currentStepNumber === 0 ) {
		return (
			<p>Unknown step progress</p>
		)
	}

	if ( props.totalSteps < props.currentStepNumber ) {
		console.error( 'Invalid totalSteps number in ProgressIndicator' );
		return <p>Step {props.currentStepNumber}</p>
	}

	return (
		<p>Step {props.currentStepNumber} of {props.totalSteps}</p>
	)
};

ProgressIndicator.propTypes = {
	currentStepNumber: React.PropTypes.number.isRequired,
	totalSteps: React.PropTypes.number.isRequired
};

export default ProgressIndicator;