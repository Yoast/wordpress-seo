import React from 'react';


const ProgressIndicator = ( props ) => {
	return (
		<div>
			<p>Step {props.currentStepNumber} of {props.totalSteps}</p>
		</div>
	);
}

ProgressIndicator.propTypes = {
	currentStepNumber: React.PropTypes.number,
	totalSteps: React.PropTypes.number,
};

ProgressIndicator.defaultProps = {
	currentStepNumber: 1,
	totalSteps: 1,
};

export default ProgressIndicator
