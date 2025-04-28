import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef, useCallback, useLayoutEffect, useRef, useState } from "react";
import { StepperContext } from "./context";
import { StepperProgressBar } from "./progress-bar";
import { Step } from "./step";

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
		const parcel = step?.getBoundingClientRect().right - startingPoint - step?.getBoundingClientRect().width / 2;
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
export const Stepper = forwardRef( ( { children, currentStep = 0, className = "", steps = [], ProgressBar = StepperProgressBar }, ref ) => {
	const [ progressBarPosition, setProgressBarPosition ] = useState( {
		left: 0,
		right: 0,
		stepsLengthPercentage: 0,
		progressBarLength: 0,
	} );
	const stepRef = useRef( [] );

	useLayoutEffect( () => {
		if ( stepRef.current.length > 0 ) {
			const firstStepRect = stepRef.current[ 0 ]?.getBoundingClientRect();
			const lastStepRect = stepRef.current[ stepRef.current.length - 1 ]?.getBoundingClientRect();

			const progressBarLength = calculateProgressBarLength( firstStepRect, lastStepRect );
			const stepsLengthPercentage = calculateStepsLengthPercentage( stepRef.current, firstStepRect, progressBarLength );

			setProgressBarPosition( {
				left: firstStepRect.width / 2,
				right: lastStepRect.width / 2,
				stepsLengthPercentage,
				progressBarLength,
			} );
		}
	}, [ stepRef.current ] );

	useLayoutEffect( () => {
		if ( ! stepRef?.current?.length ) {
			return;
		}

		// Cleanup stepRef for steps prop.
		if ( steps.length > 0 ) {
			stepRef.current = steps.map( ( step ) => stepRef.current.find( ( el ) => el && el.id === step.id ) );
		}

		// Cleanup stepRef for children prop.
		if ( children ) {
			stepRef.current = React.Children.map( children, ( child ) => stepRef.current.find( ( el ) => el && el.id === child.props.id ) );
		}
	}, [ steps, children, currentStep ] );

	const addStepRef = useCallback( ( el ) => ( stepRef.current.push( el ) ), [ stepRef.current ] );

	/**
	 * Get the percentage of the current step's progress.
	 *
	 * @param {number[]} percentage Array of step lengths in percentage.
	 * @param {number} step The index of the current step (starting from 0).
	 * @returns {number} The percentage of the current step's progress.
	 */
	const getCurrentStepPercentage = ( percentage, step ) => {
		if ( step && percentage ) {
			return percentage[ step ] ?? 100;
		}

		return 0;
	};

	if ( steps.length === 0 && ! children ) {
		return null;
	}

	return (
		<StepperContext.Provider value={ { addStepRef, currentStep } }>
			<div className={ classNames( className, "yst-stepper" ) } ref={ ref }>

				{ children || steps.map( ( step, index ) => (
					<Step
						key={ `${ step.id }-step` }
						index={ index }
						id={ step.id }
					>
						{ step.children }
					</Step>
				) ) }

				<ProgressBar
					style={ {
						right: progressBarPosition?.right,
						left: progressBarPosition?.left,
					} }
					progress={ getCurrentStepPercentage( progressBarPosition?.stepsLengthPercentage, currentStep ) }
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
		id: PropTypes.string.isRequired,
		children: PropTypes.node.isRequired,
	} ) ),
	ProgressBar: PropTypes.elementType,
};
Stepper.defaultProps = {
	className: "",
	steps: [],
	// eslint-disable-next-line no-undefined
	children: undefined,
	currentStep: 0,
	ProgressBar: StepperProgressBar,
};

Stepper.Context = StepperContext;
Stepper.ProgressBar = StepperProgressBar;
Stepper.Step = Step;
