import { filter } from "lodash-es";

/**
 * Checks for too long sentences.
 * @param {array} sentences The array with objects containing sentences and their lengths.
 * @param {number} recommendedValue The recommended maximum length of sentence.
 * @returns {array} The array with objects containing too long sentences and their lengths.
 */
export default function( sentences, recommendedValue ) {
	return filter( sentences, function( sentence ) {
		return sentence.sentenceLength > recommendedValue;
	} );
}
