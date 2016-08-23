import React from "react";
import CustomStepButton from "./StepButton";
import {Stepper, Step, StepButton} from 'material-ui/Stepper';

/**
 * The step indicator displays a horizontal progress indicator.
 * The number of steps and the current step that is active is displayed.
 */
class StepIndicator extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			stepIndex: this.props.stepIndex,
		};
	}

	/**
	 * Updates the state and re-renders the indicator when new properties are set.
	 *
	 * @param props The properties for the StepIndicator.
	 */
	componentWillReceiveProps( props ) {
		this.setState( props );
	}

	/**
	 * Renders the step buttons in the StepIndicator(Stepper).
	 **
	 * @returns {JSX.Element} The button components.
	 */
	getStepButtonComponents() {
		let keys = Object.keys( this.props.steps );

		return keys.map( ( name, key ) => {
			var currentField = this.props.steps[ name ];
			let button = {};

			if ( key === this.state.stepIndex ) {
				button = React.createElement( StepButton, {
					key: "step-indicator-" + key,
					className: "yoast-wizard-stepper-step-active",
				}, currentField.title );
			}
			// Return a custom step button, without a label for non-active steps.
			else {
				button = new CustomStepButton( {
					index: key.valueOf() + 1,
					tooltip: currentField.title,
					className: "yoast-wizard-stepper-step",
					onClick: () => {this.props.onClick(name)},
				} );
			}
			return React.createElement( Step, { key: "step-indicator-" + key }, button );
		} );
	}

	render() {
		return (
			<div className="yoast-wizard-stepper" style={{ width: '100%', margin: 'auto' }}>
				<Stepper linear={false} activeStep={this.state.stepIndex}>
					{this.getStepButtonComponents()}
				</Stepper>
			</div>
		);
	}
}

StepIndicator.propTypes = {
	steps: React.PropTypes.object.isRequired,
	stepIndex: React.PropTypes.number.isRequired,
};

StepIndicator.defaultProps = {
	stepIndex: 0,
};

export default StepIndicator;
