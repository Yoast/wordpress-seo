import { flattenDeep } from "lodash-es";
import { stemBasicPrefixes } from "../../../helpers/morphology/stemBasicPrefixes.js";

const BASIC_PREFIXES = [ "ل", "ب", "ك", "و", "ف", "س", "أ", "ال", "وب", "ول", "لل", "فس", "فب", "فل", "وس",
	"وال", "بال", "فال", "كال", "ولل", "وبال" ];
// Sort the prefixes by length, so we can match the longest prefix first.
const DESCENDING_BASIC_PREFIXES = [ ...BASIC_PREFIXES ].sort( ( a, b ) => b.length - a.length );
const BASIC_PREFIXES_REGEX = new RegExp( `^(${DESCENDING_BASIC_PREFIXES.join( "|" )})` );

/**
 * Creates basic word forms for a given Arabic word.
 *
 * @param {string} word     The word for which to create basic word forms.
 *
 * @returns {Array}        Prefixed and de-prefixed variations of a word.
 */
export function createBasicWordForms( word ) {
	const forms = [];

	/*
	 * Add prefixes to the input word. We always do this, since some words
	 * beginning with a prefix-like letter might be exceptions where this is the
	 * actual first letter of the word.
	 */
	forms.push( ...BASIC_PREFIXES.map( basicPrefix => basicPrefix + word ) );

	const { stem, prefix } = stemBasicPrefixes( word, BASIC_PREFIXES_REGEX );

	if ( prefix !== "" ) {
		/*
		If a word starts with one of the prefixes, we strip it and attach all prefixes to the stem.
		*/
		forms.push( stem );
		forms.push( ...BASIC_PREFIXES.map( basicPrefix => basicPrefix + stem ) );
	}

	return flattenDeep( forms );
}
