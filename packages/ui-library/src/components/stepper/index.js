import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef, useRef, useEffect, useState, useCallback, createContext, useContext } from "react";
import { CheckIcon } from "@heroicons/react/solid";
import { ProgressBar } from "../../index";
import { noop } from "lodash";

/**
 * Context for the stepper. Used to add a reference to the step.
 */
const StepperContext = createContext( {
	addStepRef: noop,
} );

/**
 * Step component.
 *
 * @param {string} label The step label.
 * @param {boolean} isComplete Is the step complete.
 * @param {boolean} isActive Is the step
 *
 * @returns {JSX.Element} The step element.
 */
const Step = ( { label, isComplete, isActive } ) => {
	const { addStepRef } = useContext( StepperContext );
	return (
		<div
			ref={ addStepRef }
			className={ classNames( "yst-step",
				isComplete ? "yst-step--complete" : "",
				isActive ? "yst-step--active" : "" ) }
		>
			<div className="yst-step__circle">
				{ isComplete && <CheckIcon
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
};

Step.displayName = "Step";
Step.propTypes = {
	label: PropTypes.string.isRequired,
	isActive: PropTypes.bool.isRequired,
	isComplete: PropTypes.bool.isRequired,
};

/**
 *
 * @param {JSX.Node} children Content of the stepper.
 * @param {number} numberOfSteps The umber of steps.
 * @param {string} [currentStep] The current step.
 * @param {string} [className] Optional extra className.
 *
 * @returns {JSX.Element} The Stepper element.
 */
export const Stepper = forwardRef( ( { children, numberOfSteps, currentStep, className = "" }, ref ) => {
	const [ progressBarPosition, setProgressBarPosition ] = useState( {
		left: 0,
		right: 0,
	} );
	const stepRef = useRef( [] );

	useEffect( () => {
		if ( stepRef.current.length > 0 ) {
			const firstStepRect = stepRef.current[ 0 ].getBoundingClientRect();
			const lastStepRect = stepRef.current[ numberOfSteps - 1 ].getBoundingClientRect();
			setProgressBarPosition( {
				left: firstStepRect.width / 2,
				right: lastStepRect.width / 2,
			} );
		}
	}, [ stepRef.current, numberOfSteps ] );

	if ( ! numberOfSteps ) {
		return;
	}

	const addStepRef = useCallback( ( el ) => ( stepRef.current.push( el ) ), [ stepRef.current ] );

	return (
		<StepperContext.Provider value={ { addStepRef } }>
			<div className={ classNames( className, "yst-stepper" ) } ref={ ref }>

				{ children }

				<ProgressBar
					className="yst-absolute yst-top-3 yst-w-auto yst-h-0.5"
					style={ progressBarPosition }
					min={ 0 }
					max={ numberOfSteps - 1 }
					progress={ currentStep - 1 }
				/>
			</div>
		</StepperContext.Provider>
	);
} );

Stepper.displayName = "Stepper";
Stepper.propTypes = {
	currentStep: PropTypes.number.isRequired,
	numberOfSteps: PropTypes.number.isRequired,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};
Stepper.defaultProps = {
	className: "",
};

Stepper.Step = Step;
Stepper.Context = StepperContext;
Stepper.Step.displayName = "Stepper.Step";

