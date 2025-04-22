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
 * @param {number} index The index of the step.
 *
 * @returns {JSX.Element} The step element.
 */
const Step = ( { children, index } ) => {
	const { addStepRef, currentStep } = useContext( StepperContext );
	const isActive = index === currentStep;
	const isComplete = index < currentStep;

	return (
		<div
			ref={ addStepRef }
			className={ classNames(
				"yst-step",
				isComplete && "yst-step--complete",
				isActive && "yst-step--active",
			) }
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
	index: PropTypes.number.isRequired,
};

/**
 * Calculate the length of the progress bar.
 *
 * @param {DOMRect} firstStepRect The bounding rectangle of the first step.
 * @param {DOMRect} lastStepRect The bounding rectangle of the last step.
 * @returns {number} The length of the progress bar.
 */
const calculateProgressBarLength = ( firstStepRect, lastStepRect ) => {
	return lastStepRect.right - firstStepRect.left - ( firstStepRect.width / 2 ) - ( lastStepRect.width / 2 );
};

/**
 * Calculate the length of each step in percentage.
 *
 * @param {HTMLElement[]} stepRef The list of step elements.
 * @param {DOMRect} firstStepRect The bounding rectangle of the first step.
 * @param {number} progressBarLength The length of the progress bar.
 * @returns {number[]} The length of each step in percentage.
 */
const calculateStepsLengthPercentage = ( stepRef, firstStepRect, progressBarLength ) => {
	const startingPoint = firstStepRect.left + firstStepRect.width / 2;
	return stepRef.map( ( step, index ) => {
		if ( index === 0 ) {
			return 0;
		}
		if ( index >= stepRef.length - 1 ) {
			return 100;
		}
		const parcel = step.getBoundingClientRect().right - startingPoint - step.getBoundingClientRect().width / 2;
		return ( parcel / progressBarLength ) * 100;
	} );
};

/**
 *
 * @param {JSX.Node} [children] Content of the stepper.
 * @param {number} [currentStep] The current step, starts from 0.
 * @param {string} [className] Optional extra className.
 * @param {JSX.Node[]} [steps] The steps of the stepper.
 *
 * @returns {JSX.Element} The Stepper element.
 */
export const Stepper = forwardRef( ( { children, currentStep = 0, className = "", steps = [], CustomProgressBar }, ref ) => {
	const [ progressBarPosition, setProgressBarPosition ] = useState( {
		left: 0,
		right: 0,
		StepsLengthPercentage: 0,
		progressBarLength: 0,
	} );
	const stepRef = useRef( [] );

	useLayoutEffect( () => {
		if ( stepRef.current.length > 0 ) {
			const firstStepRect = stepRef.current[ 0 ].getBoundingClientRect();
			const lastStepRect = stepRef.current[ stepRef.current.length - 1 ].getBoundingClientRect();

			const progressBarLength = calculateProgressBarLength( firstStepRect, lastStepRect );
			const StepsLengthPercentage = calculateStepsLengthPercentage( stepRef.current, firstStepRect, progressBarLength );

			setProgressBarPosition( {
				left: firstStepRect.width / 2,
				right: lastStepRect.width / 2,
				StepsLengthPercentage,
				progressBarLength,
			} );
		}
	}, [ stepRef.current ] );

	const addStepRef = useCallback( ( el ) => ( stepRef.current.push( el ) ), [ stepRef.current ] );

	/**
	 * Get the percentage of the current step's progress.
	 *
	 * @param {number[]} StepsLengthPercentage Array of step lengths in percentage.
	 * @param {number} currentStep The index of the current step (starting from 0).
	 * @returns {number} The percentage of the current step's progress.
	 */
	const getCurrentStepPercentage = ( StepsLengthPercentage, currentStep ) => {
		if ( currentStep && StepsLengthPercentage ) {
			return StepsLengthPercentage[ currentStep ] ?? 100;
		}

		return 0;
	};

	return (
		<StepperContext.Provider value={ { addStepRef, currentStep } }>
			<div className={ classNames( className, "yst-stepper" ) } ref={ ref }>

				{ children || steps.map( ( step, index ) => (
					<Step
						key={ `${ index }-step` }
						index={ index }
					>
						{ step }
					</Step>
				) ) }

				{ CustomProgressBar ? (
					<CustomProgressBar
						style={ {
							right: progressBarPosition?.right,
							left: progressBarPosition?.left,
						} }
						progress={ getCurrentStepPercentage( progressBarPosition?.StepsLengthPercentage, currentStep ) }
					/>
				) : (
					<ProgressBar
						className="yst-absolute yst-top-3 yst-w-auto yst-h-0.5"
						style={ {
							right: progressBarPosition?.right,
							left: progressBarPosition?.left,
						} }
						min={ 0 }
						max={ 100 }
						progress={ getCurrentStepPercentage( progressBarPosition?.StepsLengthPercentage , currentStep ) }
					/>
				) }
			</div>
		</StepperContext.Provider>
	);
} );

Stepper.displayName = "Stepper";
Stepper.propTypes = {
	currentStep: PropTypes.number,
	children: PropTypes.node,
	className: PropTypes.string,
	steps: PropTypes.arrayOf( PropTypes.node ),
	CustomProgressBar: PropTypes.elementType,
};
Stepper.defaultProps = {
	className: "",
	steps: [],
	// eslint-disable-next-line no-undefined
	children: undefined,
	currentStep: 0,
	// eslint-disable-next-line no-undefined
	CustomProgressBar: undefined,
};

Stepper.Step = Step;
Stepper.Context = StepperContext;
Stepper.Step.displayName = "Stepper.Step";
