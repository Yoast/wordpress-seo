import { getForms as englishGetForms } from "../morphology/english/getForms";
import { getForms as germanGetForms } from "../morphology/german/getForms";

/**
 * Collects all functions for word form building per language and returns this collection to a Researcher
 *
 * @returns {Object} Forms to be searched for keyword-based assessments for all available languages.
 */
export default function() {
	return {
		en: englishGetForms,
		de: germanGetForms,
	};
}
