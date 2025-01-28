import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef, useRef, useEffect, useState, useCallback } from "react";
import { CheckIcon } from "@heroicons/react/solid";
import { ProgressBar } from "../../index";

/**
 * Step component.
 *
 * @param {string} label The step label.
 * @param {boolean} isComplete Is the step complete.
 * @param {boolean} isActive Is the step
 * @param {boolean} isStepComplete Is the step complete.
 *
 * @returns {JSX.Element} The step element.
 */
const Step = forwardRef( ( { label, isComplete, isActive, isStepComplete }, ref ) => {
	return (
		<div
			ref={ ref }
			className={ classNames( "yst-step",
				isStepComplete ? "yst-step--complete" : "",
				isActive ? "yst-step--active" : "" ) }
		>
			<div className="yst-step__circle">
				{ isStepComplete && <CheckIcon
					className="yst-step__icon yst-w-4 yst-z-50"
				/> }

				<div
					className={
						classNames( "yst-step__icon yst-bg-primary-500 yst-w-2 yst-h-2 yst-rounded-full yst-delay-500",
							! isComplete && isActive ? "yst-opacity-100" : "yst-opacity-0" ) }
				/>
			</div>
			<div className="yst-font-semibold yst-text-xxs yst-mt-3">{ label }</div>
		</div>
	);
} );

Step.displayName = "Step";
Step.propTypes = {
	label: PropTypes.string.isRequired,
	isActive: PropTypes.bool.isRequired,
	isComplete: PropTypes.bool.isRequired,
	isStepComplete: PropTypes.bool.isRequired,
};

/**
 *
 * @param {number} currentStep The currrent step, not array index based.
 * @param {boolean} isComplete Is the step complete.
 * @param {[string]} steps The steps names.
 * @param {string} [className] Optional extra className.
 *
 * @returns {JSX.Element} The Stepper element.
 */
const Stepper = forwardRef( ( { currentStep, isComplete, steps, className = "" }, ref ) => {
	const [ progressBarPosition, setProgressBarPosition ] = useState( {
		left: 0,
		right: 0,
	} );
	const stepRef = useRef( [] );

	useEffect( () => {
		setProgressBarPosition( {
			left: stepRef.current[ 0 ].offsetWidth / 2,
			right: stepRef.current[ steps.length - 1 ].offsetWidth / 2,
		} );
	}, [ stepRef.current, steps.length ] );

	if ( ! steps.length ) {
		return;
	}

	const addStepRef = useCallback( ( el ) => ( stepRef.current.push( el ) ), [ stepRef.current ] );

	return (
		<div className={ classNames( className, "yst-stepper" ) } ref={ ref }>
			{ steps.map( ( step, index ) => <Step
				key={ step }
				label={ step }
				currentStep={ currentStep }
				isComplete={ isComplete }
				isActive={ currentStep === index + 1 }
				isStepComplete={ currentStep > index + 1 || isComplete }
				ref={ addStepRef }
			/> ) }

			<ProgressBar
				className="yst-absolute yst-top-3 yst-w-auto yst-h-0.5"
				style={ progressBarPosition }
				min={ 0 }
				max={ steps.length - 1 }
				progress={ currentStep - 1 }
			/>
		</div>

	);
} );

Stepper.displayName = "Stepper";
Stepper.propTypes = {
	currentStep: PropTypes.number.isRequired,
	isComplete: PropTypes.bool.isRequired,
	steps: PropTypes.arrayOf( PropTypes.string ).isRequired,
	className: PropTypes.string,
};
Stepper.defaultProps = {
	className: "",
};

export default Stepper;
