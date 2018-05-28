/** @module analyses/findKeywordInPageTitle */

const matchTextWithArray = require( "../stringProcessing/matchTextWithArray.js" );
const getForms = require( "../morphology/english/getForms.js" );

var escapeRegExp = require( "lodash/escapeRegExp" );

/**
 * Counts the occurrences of the keyword in the pagetitle. Returns the number of matches
 * and the position of the keyword.
 *
 * @param {object} paper The paper containing title and keyword.
 * @returns {object} result with the matches and position.
 */

module.exports = function( paper ) {
	const title = paper.getTitle();
	// const locale = paper.getLocale();

	const keyword = escapeRegExp( paper.getKeyword() );
	const keywordForms = getForms( keyword );

	let result = { matches: 0, position: -1 };
	result.matches = matchTextWithArray( title, keywordForms ).length;

	let positions = [];
	const titleLowerCase = title.toLocaleLowerCase();

	keywordForms.forEach( function( form ) {
		const formToLowerCase = form.toLocaleLowerCase();
		const keywordFormIndex = titleLowerCase.indexOf( formToLowerCase );

		if ( keywordFormIndex > -1 ) {
			positions = positions.concat( keywordFormIndex );
		}
		}
	);

	result.position = Math.min( ... positions );

	return result;
};
