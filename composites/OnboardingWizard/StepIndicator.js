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
			console.log(currentField)
			if ( key === this.state.stepIndex ) {
				var button = React.createElement( StepButton, {
					key: "step-indicator-" + key,
				}, currentField.title );
			}else{
//				var button = React.createElement( StepButton, {
//					key: "step-indicator-" + key,
//				});
				var button = new CustomStepButton( {
					index: key.valueOf() + 1,
					tooltip: currentField.title,
				} );
			}
			let step = React.createElement( Step, { key: "step-indicator-" + key }, button );
			return step;
		} );
	}

	getIcon(key){
		return (
			<SvgIcon >
				<circle cx="12" cy="12" r="10"/>
				<text
					x="12"
					y="16"
					textAnchor="middle"
					fontSize="12"
					fill="#fff"
				>
					{key}
				</text>
			</SvgIcon>
		)
	}

	render() {
		return (
			<div style={{ width: '100%', margin: 'auto' }}>
				<Stepper activeStep={this.state.stepIndex}>
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
