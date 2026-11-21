import { stemPrefixedFunctionWords } from "../../../helpers/morphology/stemPrefixedFunctionWords.js";
import { PREFIXED_FUNCTION_WORDS, PREFIXED_FUNCTION_WORDS_REGEX } from "../config/prefixedFunctionWords.js";

/**
 * Creates basic word forms for a given Hebrew word.
 *
 * @param {string} word     The word for which to create basic word forms.
 *
 * @returns {string[]} Prefixed and de-prefixed variations of a word.
 */
export function createBasicWordForms( word ) {
	const forms = [];

	/*
	 * Add prefixes to the input word. We always do this, since some words
	 * beginning with a prefix-like letter might be exceptions where this is the
	 * actual first letter of the word.
	 */
	forms.push( ...PREFIXED_FUNCTION_WORDS.map( basicPrefix => basicPrefix + word ) );

	/*
	 * If a word starts with one of the prefixes, we strip it and create all possible
	 * prefixed forms based on this stem.
	 */
	const { stem, prefix } = stemPrefixedFunctionWords( word, PREFIXED_FUNCTION_WORDS_REGEX );

	if ( prefix !== "" ) {
		forms.push( stem );
		forms.push( ...PREFIXED_FUNCTION_WORDS.map( basicPrefix => basicPrefix + stem ) );
	}

	return forms;
}
