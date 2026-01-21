import { useEffect } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";

/**
 * Timeout duration (in ms) to wait for the AI button to render after toast dismissal.
 * This accounts for toast exit animation and React re-render cycle.
 */
const BUTTON_RENDER_TIMEOUT = 1600;

/**
 * Finds the AI button element by its ID.
 *
 * @param {string} buttonId The button ID to find.
 * @returns {HTMLElement|null} The button element, or null if not found.
 */
const findButtonById = ( buttonId ) => {
	return buttonId ? document.getElementById( buttonId ) : null;
};

/**
 * Finds the fallback element to focus.
 *
 * @param {React.RefObject} fallbackRef A ref to the fallback element.
 * @param {string} fallbackElementId The ID of the fallback element.
 * @returns {HTMLElement|null} The fallback element, or null if not found.
 */
const getFallbackElement = ( fallbackRef, fallbackElementId ) => {
	if ( fallbackRef?.current ) {
		return fallbackRef.current;
	}
	return fallbackElementId ? document.getElementById( fallbackElementId ) : null;
};

/**
 * Custom hook to handle focus fallback when an AI Optimize button is removed from the DOM.
 *
 * When an AI suggestion is applied and the assessment passes, the AI Optimize button is no longer rendered.
 * This hook detects when the focus target button doesn't exist and focuses a fallback element instead,
 * preventing focus from jumping to the beginning of the page.
 *
 * @param {Object} options The hook options.
 * @param {React.RefObject} [options.fallbackRef] A ref to the element that should receive focus when the AI button is removed.
 * @param {string} [options.fallbackElementId] The ID of the element that should receive focus (alternative to fallbackRef).
 * @param {Array} [options.results] The array of assessment results for this section. Used to determine if the focus target belongs to this section.
 *
 * @returns {void}
 */
const useAIButtonFocusFallback = ( { fallbackRef = null, fallbackElementId = "", results = [] } = {} ) => {
	const focusAIButton = useSelect( ( select ) => select( "yoast-seo/editor" ).getFocusAIFixesButton(), [] );
	const { setFocusAIFixesButton } = useDispatch( "yoast-seo/editor" );

	useEffect( () => {
		if ( ! focusAIButton ) {
			return;
		}

		// Extract the assessment ID from the button ID (e.g., "introductionKeywordAIFixes" -> "introductionKeyword").
		const assessmentId = focusAIButton.replace( "AIFixes", "" );

		// Check if this assessment belongs to the current section.
		// Results use _identifier property for the assessment ID.
		const assessmentIds = results.map( ( result ) => result._identifier );
		const belongsToThisSection = assessmentIds.includes( assessmentId );

		if ( ! belongsToThisSection ) {
			return;
		}

		// Delay to allow the button component to render after toast dismissal.
		// If button doesn't exist after this delay, it means the assessment passed and button won't render.
		const timeoutId = setTimeout( () => {
			// Try to find the button by ID first. If it exists, focus it.
			// If it doesn't exist (assessment passed), focus the fallback element.
			const button = findButtonById( focusAIButton );
			const focusTarget = button || getFallbackElement( fallbackRef, fallbackElementId );

			if ( focusTarget ) {
				focusTarget.focus();
				setFocusAIFixesButton( null );
			}
		}, BUTTON_RENDER_TIMEOUT );

		return () => clearTimeout( timeoutId );
	}, [ focusAIButton, results, fallbackRef, fallbackElementId, setFocusAIFixesButton ] );
};

export default useAIButtonFocusFallback;
