/** @module analyses/getKeywordCount */
const matchTextWithArray = require( "../stringProcessing/matchTextWithArray.js" );
const normalizeQuotes = require( "../stringProcessing/quotes.js" ).normalize;
const buildKeywordForms = require( "./buildKeywordForms.js" );
const unique = require( "lodash/uniq" );

/**
 * Calculates the keyword count.
 *
 * @param {object} paper The paper containing keyword and text.
 * @returns {number} The keyword count.
 */
module.exports = function( paper ) {
	const keywordForms = buildKeywordForms( paper );
	const text = normalizeQuotes( paper.getText() );
	const keywordFormsFound = matchTextWithArray( text, keywordForms );

	return {
		count: keywordFormsFound.length,
		matches: unique( keywordFormsFound ),
	};
};
