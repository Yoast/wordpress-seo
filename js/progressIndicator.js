import React from 'react';

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
			<div>
				<p>Unknown step progress</p>
			</div>
		)
		
	return (
		<div>
			<p>Step {props.currentStepNumber} of {props.totalSteps}</p>
		</div>
	)
};

ProgressIndicator.propTypes = {
	currentStepNumber: React.PropTypes.number,
	totalSteps: React.PropTypes.number
};

ProgressIndicator.defaultProps = {
	currentStepNumber: 1,
	totalSteps: 1
};

export default ProgressIndicator;
