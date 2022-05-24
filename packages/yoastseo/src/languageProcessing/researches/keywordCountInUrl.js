/** @module researches/keywordCountInSlug */
import parseSlug from "../helpers/url/parseSlug";
import { findTopicFormsInString } from "../helpers/match/findKeywordFormsInString.js";
import { uniq } from "lodash-es";

/**
 * Splits the word form on the hyphen and adds each part into a separate array inside the array of word forms.
 *
 * @param {string[]}	wordForms			The array with the word form.
 * @param {Array[]}		dehyphenatedForms	The array with the dehyphenated word forms.
 *
 * @returns {Array[]}	The array of dehyphenated word forms.
 */
function dehyphenateWordsWithOneForm( wordForms, dehyphenatedForms ) {
	wordForms.forEach( function( wordForm ) {
		const splitWordForm = wordForm.split( "-" );
		splitWordForm.forEach( compound => dehyphenatedForms.push( [ compound ] ) );
	} );
	return dehyphenatedForms;
}

/**
 * Checks how many parts the hyphenated word has. Creates an array for each part inside the array of dehyphenated
 * word forms. Splits each word form on the hyphen and puts each part into its corresponding array (i.e. the first
 * part into the first array, the second part into the second array, etc.). The result is that parts that are
 * forms of the same word are grouped together (e.g. if the hyphenated keyphrase forms are 'ex-husband' and 'ex-husbands',
 * 'husband' and 'husbands' are grouped together as forms of the same word).
 *
 * @param {string[]}	wordForms		The array with the word forms.
 * @param {Array[]}		dehyphenatedForms	The array with the dehyphenated word forms.
 *
 * @returns {Array[]}	The array of dehyphenated word forms.
 */
function dehyphenateWordsWithMultipleForms( wordForms, dehyphenatedForms ) {
	/*
	 * Create one array for each part of the dehyphenated word in the array of dehyphenated word forms.
	 * Put a number corresponding to the index of the part inside the array so that later we can put the part in the correct
	 * array by looking for the array that contains the part index.
	 */
	const firstWordFormSplit = wordForms[ 0 ].split( "-" );
	const numberOfParts = firstWordFormSplit.length;
	for ( let i = 0; i < numberOfParts; i++ ) {
		dehyphenatedForms.push( [ i ] );
	}

	// Split each word form on the hyphen and put each part into the corresponding array based on the index.
	wordForms.forEach( function( wordForm ) {
		const splitWordForm = wordForm.split( "-" );

		for ( let i = 0; i < numberOfParts; i++ ) {
			dehyphenatedForms[ i ].push( splitWordForm[ i ] );
		}
	} );

	// Remove numbers and duplicates from the array of word forms.
	for ( let i = 0; i < dehyphenatedForms.length; i++ ) {
		dehyphenatedForms[ i ] = uniq( dehyphenatedForms[ i ] );
		// Remove the numbers indicating the part index.
		dehyphenatedForms[ i ].shift();
	}

	return dehyphenatedForms;
}

/**
 * Splits hyphenated keyphrases so that each part is an individual word, e.g. 'pop-art' becomes 'pop' and 'art'.
 * Splitting the keyphrase forms allows for hyphenated keyphrases to be detected in the slug. The slug is parsed on hyphens, and the words from
 * the keyphrase are compared with the words from the slug to find a match. Without dehyphenating the keyphrase, the word from the keyphrase would be
 * 'pop-art' while the words from the slug would be 'pop' and 'art', and a match would not be detected.
 *
 * @param {Array} topicForms The keyphraseForms and synonymsForms of the paper.
 *
 * @returns {Array} topicForms with split compounds.
 */
function dehyphenateKeyphraseForms( topicForms ) {
	let dehyphenatedKeyphraseForms = [];

	topicForms.keyphraseForms.forEach( function( wordForms ) {
		// If a word doesn't contain hyphens, don't split it.
		if ( wordForms[ 0 ].indexOf( "-" ) === -1 ) {
			dehyphenatedKeyphraseForms.push( wordForms );
			return;
		}

		if ( wordForms.length === 1 ) {
			dehyphenatedKeyphraseForms = dehyphenateWordsWithOneForm( wordForms, dehyphenatedKeyphraseForms );
		} else {
			dehyphenatedKeyphraseForms = dehyphenateWordsWithMultipleForms( wordForms, dehyphenatedKeyphraseForms );
		}
	} );

	topicForms.keyphraseForms = dehyphenatedKeyphraseForms;

	return topicForms;
}

/**
 * Matches the keyword in the slug. Replaces all dashes and underscores with whitespaces and uses whitespace as word boundary.
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 *
 * @returns {{keyphraseLength: int, percentWordMatches: int}} The length of the keyphrase and the percentage of keyphrase forms that has been found.
 */
function keywordCountInSlug( paper, researcher ) {
	const topicForms = dehyphenateKeyphraseForms( researcher.getResearch( "morphology" ) );
	const parsedSlug = parseSlug( paper.getSlug() );
	const locale = paper.getLocale();

	const keyphraseInSlug = findTopicFormsInString( topicForms, parsedSlug, false, locale );

	return {
		keyphraseLength: topicForms.keyphraseForms.length,
		percentWordMatches: keyphraseInSlug.percentWordMatches,
	};
}

/**
 * Matches the keyword in the slug.
 * keywordCountInUrl was the previous name for keywordCountInSlug (hence the name of this file).
 * We keep (and expose) this research for backwards compatibility.
 *
 * @deprecated Since version 18.7. Use keywordCountInSlug instead.
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 *
 * @returns {{keyphraseLength: int, percentWordMatches: int}} The length of the keyphrase and the percentage of keyphrase forms that has been found.
 */
function keywordCountInUrl( paper, researcher ) {
	console.warn( "This function is deprecated, use keywordCountInSlug instead." );
	return keywordCountInSlug( paper, researcher );
}

export {
	keywordCountInSlug,
	keywordCountInUrl,
};

export default keywordCountInSlug;
