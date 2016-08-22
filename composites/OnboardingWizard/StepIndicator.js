import React from "react";
import CustomStepButton from "./StepButton";

import {
	Step,
	StepButton,
	Stepper,
	StepLabel,
	SvgIcon,
} from 'material-ui/Stepper';


class StepIndicator extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			stepIndex: this.props.stepIndex,
		};
	}

	componentWillReceiveProps( props ) {
		this.setState( props );
	}

	/**
	 * Renders a field for the current step.
	 *
	 * @param {Object} steps The form steps to be created.
	 *
	 * @returns {JSX.Element} The form component containing its form field components.
	 */
	getStepComponents() {
		let keys = Object.keys( this.props.steps );

		return keys.map( ( name, key ) => {
			var currentField = this.props.steps[ name ];
			let button = {};

			if ( key === this.state.stepIndex ) {
				button = React.createElement( StepButton, {
					key: "step-indicator-" + key,
					color: "#a4286a",
				}, currentField.title );
			}
			// Return a custom step button, without a label for non-active steps.
			else {
				button = new CustomStepButton( {
					index: key.valueOf() + 1,
					tooltip: currentField.title,
					onClick: () => {
						this.props.onClick(name)
					}
				} );
			}
			return React.createElement( Step, { key: "step-indicator-" + key }, button );
		} );
	}

	render() {
		return (
			<div style={{ width: '100%', margin: 'auto' }}>
				<Stepper linear={false} activeStep={this.state.stepIndex}>
					{this.getStepComponents()}
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
