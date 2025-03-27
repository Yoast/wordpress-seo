import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef, useRef, useState, useCallback, createContext, useContext, useLayoutEffect } from "react";
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
 * @param {JSX.Node} children The step label or children.
 * @param {boolean} isComplete Is the step complete.
 * @param {boolean} isActive Is the step
 *
 * @returns {JSX.Element} The step element.
 */
const Step = ( { children, isComplete, isActive } ) => {
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
			<div className="yst-font-semibold yst-text-xxs yst-mt-3">{ children }</div>
		</div>
	);
};

Step.displayName = "Step";
Step.propTypes = {
	children: PropTypes.node.isRequired,
	isActive: PropTypes.bool.isRequired,
	isComplete: PropTypes.bool.isRequired,
};

/**
 * @typeof Step {object} The step object.
 * @property {JSX.Node} children The element or label of the step.
 * @property {boolean} isComplete Is the step complete.
 * @property {boolean} isActive Is the step active.
 */

/**
 *
 * @param {JSX.Node} [children] Content of the stepper.
 * @param {number} [currentStep] The current step, starts from 0.
 * @param {string} [className] Optional extra className.
 * @param {Step[]} [steps] The steps of the stepper.
 *
 * @returns {JSX.Element} The Stepper element.
 */
export const Stepper = forwardRef( ( { children, currentStep = 0, className = "", steps }, ref ) => {
	const [ progressBarPosition, setProgressBarPosition ] = useState( {
		left: 0,
		right: 0,
	} );
	const stepRef = useRef( [] );

	useLayoutEffect( () => {
		if ( stepRef.current.length > 0 ) {
			const firstStepRect = stepRef.current[ 0 ].getBoundingClientRect();
			const lastStepRect = stepRef.current[ stepRef.current.length - 1 ].getBoundingClientRect();
			setProgressBarPosition( {
				left: firstStepRect.width / 2,
				right: lastStepRect.width / 2,
			} );
		}
	}, [ stepRef.current ] );

	const addStepRef = useCallback( ( el ) => ( stepRef.current.push( el ) ), [ stepRef.current ] );

	return (
		<StepperContext.Provider value={ { addStepRef } }>
			<div className={ classNames( className, "yst-stepper" ) } ref={ ref }>

				{ children || steps.map( ( step, index ) => (
					<Step
						key={ `${ index }-step` }
						isActive={ step.isActive }
						isComplete={ step.isComplete }
					>
						{ step.children }
					</Step>
				) ) }

				<ProgressBar
					className="yst-absolute yst-top-3 yst-w-auto yst-h-0.5"
					style={ progressBarPosition }
					min={ 0 }
					max={ stepRef.current.length - 1 }
					progress={ currentStep }
				/>
			</div>
		</StepperContext.Provider>
	);
} );

Stepper.displayName = "Stepper";
Stepper.propTypes = {
	currentStep: PropTypes.number,
	children: PropTypes.node,
	className: PropTypes.string,
	steps: PropTypes.arrayOf( PropTypes.shape( {
		children: PropTypes.node.isRequired,
		isComplete: PropTypes.bool,
		isActive: PropTypes.bool,
	} ) ),
};
Stepper.defaultProps = {
	className: "",
	steps: [],
	children: null,
	currentStep: 0,
};

Stepper.Step = Step;
Stepper.Context = StepperContext;
Stepper.Step.displayName = "Stepper.Step";
