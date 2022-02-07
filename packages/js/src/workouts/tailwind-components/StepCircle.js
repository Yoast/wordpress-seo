import { CheckIcon } from "@heroicons/react/solid";
import { useState, useEffect } from "@wordpress/element";
import PropTypes from "prop-types";
import { stepperTimingClasses } from "../stepper-helper";
import { useStepperContext } from "./Stepper";
/* eslint-disable complexity, max-len */

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
 * @param {Object} props The props object.
 * @param {bool} props.isVisible Whether this circle is visible or not.
 *
 * @returns {WPElement} The ActiveCircle element.
 */
function ActiveCircle( { isVisible } ) {
	return <span
		className={ `yst-bg-white yst-border-primary-500 ${ getCommonClasses( isVisible ) }` }
	>
		<span className={ "yst-h-2.5 yst-w-2.5 yst-rounded-full yst-bg-primary-500" } />
	</span>;
}

ActiveCircle.propTypes = {
	isVisible: PropTypes.bool,
};

ActiveCircle.defaultProps = {
	isVisible: true,
};

/**
 * The SavedCircle element.
 *
 * @param {Object} props The props object.
 * @param {bool} props.isVisible Whether this circle is visible or not.
 *
 * @returns {WPElement} The SavedCircle element
 */
function SavedCircle( { isVisible } ) {
	return <span
		className={ `yst-bg-primary-500 yst-border-primary-500 ${ getCommonClasses( isVisible ) }` }
	>
		<CheckIcon className={ "yst-w-5 yst-h-5 yst-text-white" } aria-hidden="true" />
	</span>;
}

SavedCircle.propTypes = {
	isVisible: PropTypes.bool,
};

SavedCircle.defaultProps = {
	isVisible: true,
};

/**
 * The UpcomingCircle element.
 *
 * @param {Object} props The props object.
 * @param {bool} props.isVisible Whether this circle is visible or not.
 *
 * @returns {WPElement} The UpcomingCircle element
 */
function UpcomingCircle( { isVisible } ) {
	return <span
		className={ `yst-bg-white yst-border-gray-300 ${ getCommonClasses( isVisible ) }` }
	>
		<span className={ "yst-h-2.5 yst-w-2.5 yst-rounded-full yst-bg-transparent" } />
	</span>;
}

UpcomingCircle.propTypes = {
	isVisible: PropTypes.bool,
};

UpcomingCircle.defaultProps = {
	isVisible: true,
};

/**
 * The Circle that accompanies a step, in all its active-inactive saved-unsaved flavours.
 *
 * @param {Object} props The props to pass to the StepCircle.
 *
 * @returns {WPElement} The StepCircle component.
 */
export function StepCircle( { activationDelay, deactivationDelay, isFinished } ) {
	const { activeStepIndex, stepIndex, lastStepIndex } = useStepperContext();
	const isLastStep = stepIndex === lastStepIndex;
	const isActive = activeStepIndex === stepIndex;
	const [ isCircleActive, setCircleActive ] = useState( () => {
		// Only return true if isActive and not the last step.
		return isActive ? ! isLastStep : false;
	} );

	useEffect( () => {
		if ( isActive ) {
			setTimeout( () => {
				setCircleActive( true );
			}, activationDelay );
			return;
		}
		// Set activation delay on the inactive class.
		setTimeout( () => {
			setCircleActive( false );
		}, deactivationDelay );
	}, [ isActive, isLastStep, activationDelay, deactivationDelay ] );

	return <span
		className={ "yst-relative yst-z-10 yst-w-8 yst-h-8 yst-rounded-full" }
	>
		<UpcomingCircle isVisible={ true } />
		<SavedCircle isVisible={ isFinished } />
		<ActiveCircle isVisible={ isCircleActive } />
	</span>;
}

StepCircle.propTypes = {
	isFinished: PropTypes.bool.isRequired,
	activationDelay: PropTypes.number,
	deactivationDelay: PropTypes.number,
};

StepCircle.defaultProps = {
	activationDelay: 0,
	deactivationDelay: 0,
};
