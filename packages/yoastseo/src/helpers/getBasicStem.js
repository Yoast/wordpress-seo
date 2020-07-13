import { createBasicStem as createBasicStemHebrew } from "../morphology/hebrew/createBasicStem";


/**
 * Collects all functions for creating a basic stem stem per language.
 *
 * @returns {Object} An object with basic stemming functions for multiple languages.
 */
export default function() {
	return {
		he: createBasicStemHebrew,
	};
}
