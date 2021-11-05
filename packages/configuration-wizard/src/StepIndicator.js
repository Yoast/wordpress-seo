/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import { Stepper, Step, StepButton } from "material-ui/Stepper";
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import CustomStepButton from "./StepButton";

/**
 * The step indicator displays a horizontal progress indicator.
 * The number of steps and the current step that is active is displayed.
 */
class StepIndicator extends React.Component {
	/**
	 * Initializes the stepIndex(current step number) for the StepIndicator, based on the properties.
	 *
	 * @param {object} props The properties for the StepIndicator.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			stepIndex: this.props.stepIndex,
		};
	}

	/**
	 * Updates the state and re-renders the indicator when new properties are set.
	 *
	 * @param {object} props The properties for the StepIndicator.
	 * @returns {void}
	 */
	componentWillReceiveProps( props ) {
		this.setState( props );
	}

	/**
	 * Renders the step buttons in the StepIndicator(Stepper).
	 *
	 * @returns {JSX.Element} The button components.
	 */
	getStepButtonComponents() {
		const keys = Object.keys( this.props.steps );
		const amountOfSteps = keys.length;
		let button = {};

		return keys.map( ( name, key ) => {
			var currentField = this.props.steps[ name ];
			const stepNumber = key.valueOf() + 1;
			/* %1$d expands to the number of the step, %2$s expands to the name of the step */
			let ariaLabel = __( "Step %1$d: %2$s", "wordpress-seo" );
			ariaLabel = ariaLabel.replace( "%1$d", stepNumber ).replace( "%2$s", currentField.title );

			if ( key === this.state.stepIndex ) {
				button = React.createElement( StepButton, {
					key: "step-indicator-" + key,
					className: "yoast-wizard--step yoast-wizard--step__active",
					"aria-label": ariaLabel,
					"aria-current": "step",
					style: {
						verticalAlign: "middle",
					},
				}, currentField.title );
			} else {
				// Return a custom step button, without a label for non-active steps.
				const className = this.getStepButtonClass( key, amountOfSteps );

				button = <CustomStepButton
					index={ stepNumber.toString() }
					tooltip={ currentField.title }
					ariaLabel={ ariaLabel }
					className={ className }
					tooltipStyles={ { userSelect: "auto" } }
					onClick={ evt => this.props.onClick( name, evt ) }
				/>;
			}
			return React.createElement( Step, { key: "step-indicator-" + key }, button );
		} );
	}

	/**
	 * Renders the StepIndicator
	 *
	 * @returns {JSX.Element} The rendered step indicator.
	 */
	render() {
		return (
			<nav className="yoast-wizard--stepper">
				<Stepper linear={ false } activeStep={ this.state.stepIndex }>
					{ this.getStepButtonComponents() }
				</Stepper>
			</nav>
		);
	}

	/**
	 * Determines the class names the step button should get, based on current stepkey and the total amount of steps.
	 * @param {int} stepKey       The current step key/
	 * @param {int} amountOfSteps The total amount of steps.
	 * @returns {string} The classname for the step.
	 */
	getStepButtonClass( stepKey, amountOfSteps ) {
		if ( stepKey === 0 ) {
			return "yoast-wizard--step yoast-wizard--step__first";
		}

		if ( stepKey === amountOfSteps - 1 ) {
			return "yoast-wizard--step yoast-wizard--step__last";
		}

		return "yoast-wizard--step yoast-wizard--step__inactive";
	}
}

StepIndicator.propTypes = {
	steps: PropTypes.object.isRequired,
	stepIndex: PropTypes.number.isRequired,
	onClick: PropTypes.func,
};

StepIndicator.defaultProps = {
	onClick: () => null,
};

export default StepIndicator;
