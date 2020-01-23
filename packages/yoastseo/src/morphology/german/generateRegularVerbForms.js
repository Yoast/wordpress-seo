import { addVerbSuffixes } from "./addVerbSuffixes";
import { generateParticipleForm } from "./generateParticipleForm";

/**
 * Generates regular verb forms.
 *
 * @param {Object}  morphologyDataVerbs The German morphology data for verbs.
 * @param {string}  stemmedWord         The stemmed word for which to create the regular verb forms.
 *
 * @returns {string[]} The created verb forms.
 */
export function generateRegularVerbForms( morphologyDataVerbs, stemmedWord ) {
	return [
		...addVerbSuffixes( morphologyDataVerbs, stemmedWord ),
		generateParticipleForm( morphologyDataVerbs, stemmedWord ),
	];
}
