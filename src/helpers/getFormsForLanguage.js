const englishGetForms = require( "../morphology/english/getForms.js" );

/**
 * Collects all functions for word form building per language and returns this collection to a Researcher
 *
 * @returns {Object} Forms to be searched for keyword-based assessments for all available languages.
 */
export default function() {
	return {
		en: englishGetForms,
	};
}
