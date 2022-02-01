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
const closeDelayClass = "yst-delay-200";

export const stepperTimingSettings  = {
	openAndCloseDuration,
	fadeDuration,
	openDelay,
	fadeInDelay,
	closeDelay,
	fadeDurationClass,
	totalStepDurationClass,
	openDelayClass,
	closeDelayClass,
};

/**
 * Gets the index to expand on first render of the stepper.
 *
 * If available, the index of the first unsaved step is returned.
 * If all steps have been finished, the index of the last step is returned.
 * Otherwise, returns the index of the first step.
 *
 * @param {Boolean[]} isSavedSteps Array with the isSaved values for each of the steps.
 *
 * @returns {int} The index to expand.
 */
export function getInitialActiveStepIndex( isSavedSteps ) {
	// If anything other than an array has been provided, or it is an empty array, return 0.
	if ( ! Array.isArray( isSavedSteps ) || isSavedSteps.length === 0 ) {
		return 0;
	}

	// Get the index of the first element that has not been saved yet.
	const index = isSavedSteps.findIndex( ( element ) => element === false );
	if ( index !== -1 ) {
		return index;
	}

	// If all steps have been finished, return the index of the last step.
	if ( isSavedSteps.every( Boolean ) ) {
		return isSavedSteps.length - 1;
	}

	return 0;
}
