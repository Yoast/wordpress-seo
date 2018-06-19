/** @module analyses/findKeywordInPageTitle */

const matchTextWithArray = require( "../stringProcessing/matchTextWithArray.js" );
const normalizeQuotes = require( "../stringProcessing/quotes.js" ).normalize;
const buildKeywordForms = require( "./buildKeywordForms.js" );
const map = require( "lodash/map" );
const toLower = require( "lodash/toLower" );

/**
 * Counts the occurrences of the keyword in the pagetitle. Returns the number of matches
 * and the position of the keyword.
 *
 * @param {object} paper The paper containing title and keyword.
 * @returns {object} result with the matches and position.
 */

module.exports = function( paper ) {
	const title = normalizeQuotes( paper.getTitle() );
	const keywordForms = buildKeywordForms( paper );

	let result = { matches: 0, position: -1 };
	result.matches = matchTextWithArray( title, keywordForms ).length;

	let positions = [];
	const titleLowerCase = title.toLocaleLowerCase();
	const keywordFormsLowerCase = map( keywordForms, function( form ) {
		return toLower( form );
	} );

	keywordFormsLowerCase.forEach( function( form ) {
		const keywordFormIndex = titleLowerCase.indexOf( form );

		if ( keywordFormIndex > -1 ) {
			positions = positions.concat( keywordFormIndex );
		}
	} );

	result.position = Math.min( ... positions );

	return result;
};
