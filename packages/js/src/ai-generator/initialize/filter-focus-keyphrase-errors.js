import { isConsideredEmpty } from "../helpers";
import { select as wpSelect } from "@wordpress/data";
import { STORE_NAME_AI } from "../constants";
import { __ } from "@wordpress/i18n";

let hasInteractedWithFeature = false;
/**
 * Used to keep track of whether the user interacted with this feature.
 * @returns {void}
 */
export const updateInteractedWithFeature = () => {
	if ( hasInteractedWithFeature ) {
		return;
	}
	hasInteractedWithFeature = true;
};

/**
 * Adds a focus keyphrase error, if applicable.
 *
 * @param {string[]} errors The current errors.
 * @param {string} focusKeyphrase The current focus keyphrase.
 *
 * @returns {string[]} The errors.
 */
export const filterFocusKeyphraseErrors = ( errors, focusKeyphrase ) => {
	if ( ! hasInteractedWithFeature || ! wpSelect( STORE_NAME_AI ).selectHasAiGeneratorConsent() ) {
		// No interaction or consent: don't adjust the errors.
		return errors;
	}

	if ( isConsideredEmpty( focusKeyphrase ) ) {
		errors.push( __( "Please enter a valid focus keyphrase.", "wordpress-seo" ) );
	}

	return errors;
};
