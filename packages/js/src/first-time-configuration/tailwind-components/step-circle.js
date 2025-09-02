import { CheckIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "@wordpress/element";
import PropTypes from "prop-types";
import { stepperTimingClasses } from "../stepper-helper";
import { useStepperContext } from "./stepper";

const { slideDuration, delayUntilStepFaded } = stepperTimingClasses;
const commonCircleClasses = `yst-transition-opacity ${ slideDuration } yst-absolute yst-inset-0 yst-border-2 yst-flex yst-items-center yst-justify-center yst-rounded-full`;

/**
 * Helper function for StepCircle classes.
 *
 * @param {Boolean} isVisible Whether this circle is visible.
 *
 * @returns {String} Classes catered to this visibility state for StepCircles.
 */
function getCommonClasses( isVisible ) {
	return `${ commonCircleClasses } ${ isVisible ? "yst-opacity-100" : `${ delayUntilStepFaded } yst-opacity-0` }`;
}

/**
 * The ActiveCircle element.
 *
 * @param {boolean} [isVisible=true] Whether this circle is visible or not.
 *
 * @returns {JSX.Element} The ActiveCircle element.
 */
export function ActiveCircle( { isVisible = true } ) {
	return <span
		className={ `yst-bg-white yst-border-primary-500 ${ getCommonClasses( isVisible ) }` }
	>
		<span className={ "yst-h-2.5 yst-w-2.5 yst-rounded-full yst-bg-primary-500" } />
	</span>;
}

ActiveCircle.propTypes = {
	isVisible: PropTypes.bool,
};

/**
 * The SavedCircle element.
 *
 * @param {boolean} [isVisible=true] Whether this circle is visible or not.
 *
 * @returns {JSX.Element} The SavedCircle element.
 */
function SavedCircle( { isVisible = true } ) {
	return <span
		className={ `yst-bg-primary-500 yst-border-primary-500 ${ getCommonClasses( isVisible ) }` }
	>
		<CheckIcon className={ "yst-w-5 yst-h-5 yst-text-white" } aria-hidden="true" />
	</span>;
}

SavedCircle.propTypes = {
	isVisible: PropTypes.bool,
};

/**
 * The UpcomingCircle element.
 *
 * @param {boolean} [isVisible=true] Whether this circle is visible or not.
 *
 * @returns {JSX.Element} The UpcomingCircle element.
 */
function UpcomingCircle( { isVisible = true } ) {
	return <span
		className={ `yst-bg-white yst-border-slate-300 ${ getCommonClasses( isVisible ) }` }
	>
		<span className={ "yst-h-2.5 yst-w-2.5 yst-rounded-full yst-bg-transparent" } />
	</span>;
}

UpcomingCircle.propTypes = {
	isVisible: PropTypes.bool,
};

/**
 * The Circle that accompanies a step, in all its active-inactive saved-unsaved flavours.
 *
 * @param {boolean} isFinished Whether the step is finished.
 * @param {number} [activationDelay=0] Activation delay in ms.
 * @param {number} [deactivationDelay=0] Deactivation delay in ms.
 *
 * @returns {JSX.Element} The StepCircle component.
 */
export function StepCircle( {
	activationDelay = 0,
	deactivationDelay = 0,
	isFinished,
} ) {
	const { activeStepIndex, stepIndex, lastStepIndex } = useStepperContext();
	const isLastStep = stepIndex === lastStepIndex;
	const isActive = activeStepIndex === stepIndex;
	const [ isCircleActive, setCircleActive ] = useState( () => {
		// Only return true if isActive and not the last step.
		return isActive ? ! isLastStep : false;
	} );

	useEffect( () => {
		if ( isActive ) {
			const delayedActiveCircle = setTimeout( () => {
				setCircleActive( true );
			}, activationDelay );
			return () => clearTimeout( delayedActiveCircle );
		}
		// Set activation delay on the inactive class.
		const delayedInactiveCircle = setTimeout( () => {
			setCircleActive( false );
		}, deactivationDelay );
		return () => clearTimeout( delayedInactiveCircle );
	}, [ isActive, isLastStep, activationDelay, deactivationDelay ] );

	return <span
		className={ "yst-relative yst-z-10 yst-w-8 yst-h-8 yst-rounded-full" }
	>
		<UpcomingCircle isVisible={ true } />
		<SavedCircle isVisible={ isFinished } />
		<ActiveCircle isVisible={ isCircleActive && ! isLastStep } />
	</span>;
}

StepCircle.propTypes = {
	isFinished: PropTypes.bool.isRequired,
	activationDelay: PropTypes.number,
	deactivationDelay: PropTypes.number,
};
