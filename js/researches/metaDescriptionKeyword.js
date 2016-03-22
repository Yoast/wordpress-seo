var matchTextWithWord = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Matches the keyword in the description if a description and keyword are available.
 * default is -1 if no description and/or keyword is specified
 *
 * @param {Paper} paper The paper object containing the description.
 * @returns {number} The number of matches with the keyword
 */
module.exports = function( paper ) {
	if ( paper.hasDescription() && paper.hasKeyword() ) {
		return matchTextWithWord( paper.getDescription(), paper.getKeyword() );
	}
};

