import { CheckIcon } from "@heroicons/react/solid";
import { useState, useEffect } from "@wordpress/element";
import PropTypes from "prop-types";

/* eslint-disable complexity, max-len */
// CONSTANTS

// Open and close duration in milliseconds.
const openAndCloseDuration = 500;

// Fade in and out duration in milliseconds.
const fadeDuration = 200;

// The duration of no movement between opening and closing steps.
const pauseDuration = 200;

// Wait for previous step to close, fade, and add the pause.
const openDelay = openAndCloseDuration + fadeDuration + pauseDuration;

// Wait for the step to have opened.
const fadeInDelay = openDelay + openAndCloseDuration;

// Wait for the step to have faded out.
const closeDelay = fadeDuration;

// There is no fade out delay: it is immediate.

// Tailwindclasses based on the above:
const fadeDurationClass = "yst-duration-200";
const totalStepDurationClass = "yst-duration-[700ms]";
const openDelayClass = "yst-delay-[900ms]";

export const stepperTimingSettings  = {
	openAndCloseDuration,
	fadeDuration,
	openDelay,
	fadeInDelay,
	closeDelay,
	fadeDurationClass,
	totalStepDurationClass,
	openDelayClass,
};

/**
 * The ActiveCircle element.
 *
 * @param {Object} props The props object.
 * @param {bool} props.isVisible Whether this circle is visible or not.
 *
 * @returns {WPElement} The ActiveCircle element
 */
function ActiveCircle( { isVisible } ) {
	return <span
		className={ `yst-transition-opacity ${ totalStepDurationClass } ${ isVisible ? "yst-opacity-100" : "yst-opacity-0" } yst-absolute yst-inset-0 yst-bg-white yst-border-primary-500 yst-border-2 yst-flex yst-items-center yst-justify-center yst-rounded-full` }
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
		className={ `yst-transition-opacity ${ totalStepDurationClass } ${ isVisible ? "yst-opacity-100" : "yst-opacity-0" } yst-absolute yst-inset-0 yst-bg-primary-500 yst-border-primary-500 yst-border-2 yst-flex yst-items-center yst-justify-center yst-rounded-full` }
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
		className={ `yst-transition-opacity ${ totalStepDurationClass } ${ isVisible ? "yst-opacity-100" : "yst-opacity-0" } yst-absolute yst-inset-0 yst-bg-white yst-border-gray-300 yst-border-2 yst-flex yst-items-center yst-justify-center yst-rounded-full` }
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
export function StepCircle( { activationDelay, isLastStep, deactivationDelay, isActive, isSaved } ) {
	const [ circleType, setCircleType ] = useState( isSaved ? "saved" : "upcoming" );

	useEffect( () => {
		if ( isActive ) {
			// Set deactivation delay on the active class, mind the ending space.
			setTimeout( () => {
				setCircleType( isLastStep ? "saved" : "active" );
			}, activationDelay );
			return;
		}
		// Set activation delay on the inactive class, mind the ending space.
		setTimeout( () => {
			setCircleType( isSaved ? "saved" : "upcoming" );
		}, deactivationDelay );
	}, [ isActive, isLastStep, activationDelay, deactivationDelay, isSaved ] );

	return <span
		className={ "yst-relative yst-z-10 yst-w-8 yst-h-8 yst-rounded-full" }
	>
		<UpcomingCircle isVisible={ true } />
		<SavedCircle isVisible={ circleType === "saved" } />
		<ActiveCircle isVisible={ circleType === "active" } />
	</span>;
}

StepCircle.propTypes = {
	isActive: PropTypes.bool.isRequired,
	isSaved: PropTypes.bool.isRequired,
	activationDelay: PropTypes.number,
	deactivationDelay: PropTypes.number,
};

StepCircle.defaultProps = {
	activationDelay: 0,
	deactivationDelay: 0,
};
