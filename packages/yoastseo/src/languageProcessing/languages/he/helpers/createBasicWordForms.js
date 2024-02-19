import { stemBasicPrefixes } from "../../../helpers/morphology/stemBasicPrefixes.js";

const BASIC_PREFIXES = [ "ב", "ה", "ו", "כ", "ל", "מ", "ש" ];
const BASIC_PREFIXES_REGEX = new RegExp( `^(${BASIC_PREFIXES.join( "|" )})` );

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
	forms.push( ...BASIC_PREFIXES.map( basicPrefix => basicPrefix + word ) );

	/*
	 * If a word starts with one of the prefixes, we strip it and create all possible
	 * prefixed forms based on this stem.
	 */
	const { stem, prefix } = stemBasicPrefixes( word, BASIC_PREFIXES_REGEX );

	if ( prefix !== "" ) {
		forms.push( stem );
		forms.push( ...BASIC_PREFIXES.map( basicPrefix => basicPrefix + stem ) );
	}

	return forms;
}
