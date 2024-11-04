// CONSTANTS

/*
	Stepper animations, sequence in steps:
	1. The now inactive step fades out (fadeDuration)
	2. The now inactive step closes (slideDuration)
	3. Pause (pauseDuration)
	4. The new active step opens (slideDuration)
	5. The new active step fades in (fadeDuration)
*/

// Fade in and out duration in milliseconds.
const fadeDuration = 200;

// Open and close duration in milliseconds.
const slideDuration = 500;

// The duration of no movement between opening and closing steps.
const pauseDuration = 200;

// Wait for previous step to close, fade, and add the pause.
const delayBeforeOpening = slideDuration + fadeDuration + pauseDuration;

// Wait for the step to have opened.
const delayBeforeFadingIn = delayBeforeOpening + slideDuration;

// Wait for the step to have faded out.
const delayBeforeClosing = fadeDuration;

// There is no fade out delay: it is immediate.

export const stepperTimings = {
	slideDuration,
	fadeDuration,
	delayBeforeOpening,
	delayBeforeFadingIn,
	delayBeforeClosing,
};

// Tailwind classes based on the constants defined above:
export const stepperTimingClasses  = {
	fadeDuration: "yst-duration-200",
	slideDuration: "yst-duration-500",
	delayBeforeOpening: "yst-delay-[900ms]",
	delayUntilStepFaded: "yst-delay-200",
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
