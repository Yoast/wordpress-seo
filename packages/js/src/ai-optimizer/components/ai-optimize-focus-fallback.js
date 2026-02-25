import { dispatch } from "@wordpress/data";

/**
 * Handles focus fallback to the parent analysis section toggle when the AI Optimize
 * button targeted by focusAIButtonId is no longer present in the DOM
 * (e.g. the assessment result was removed after a successful AI fix).
 *
 * Call this from componentDidUpdate and clean up the timer in componentWillUnmount.
 *
 * @param {Object}      params                   The parameters.
 * @param {string|null} params.focusAIButtonId   The ID of the AI button requested to focus.
 * @param {string}      params.locationContext   The current location context (e.g. "sidebar").
 * @param {Array}       params.results           The assessment results in this section.
 * @param {string}      params.fallbackElementId The ID of the section toggle to focus as fallback.
 * @param {Object}      params.timerRef          A mutable object ({ current: null }) for the timer ID.
 *
 * @returns {void}
 */
const handleAIOptimizeFocusFallback = ( { focusAIButtonId, locationContext, results, fallbackElementId, timerRef } ) => {
	clearTimeout( timerRef.current );

	if ( ! focusAIButtonId || ! fallbackElementId ) {
		return;
	}

	// Only handle focus requests for this location.
	const suffix = `AIFixes-${ locationContext }`;
	if ( ! focusAIButtonId.endsWith( suffix ) ) {
		return;
	}

	// Extract the assessment ID and check if it belongs to this section.
	const assessmentId = focusAIButtonId.slice( 0, -suffix.length );
	if ( ! results.some( ( result ) => result.getIdentifier() === assessmentId ) ) {
		return;
	}

	// Give AIOptimizeButton's useLayoutEffect a chance to handle focus first.
	timerRef.current = setTimeout( () => {
		const button = document.getElementById( focusAIButtonId );
		if ( ! button ) {
			const fallbackElement = document.getElementById( fallbackElementId );
			if ( fallbackElement ) {
				fallbackElement.focus();
			}
			dispatch( "yoast-seo/editor" ).setFocusAIFixesButtonId( null );
		}
	}, 100 );
};

export default handleAIOptimizeFocusFallback;
