const parseSynonyms = require( "../stringProcessing/parseSynonyms" );

/**
 * Gets the synonyms from the keyword field (provisionally) or from the synonym field, parses them into an array.
 * @param {Paper} paper The Paper object to get the synonyms from.
 *
 * @returns {Object} The object with fields keyword and synonyms.
 */
module.exports = function( paper ) {
	const keyphrase = paper.getKeyword();
	let synonyms = parseSynonyms( keyphrase );

	if ( synonyms.length < 2 ) {
		return {
			keyword: keyphrase,
			synonyms: [],
		};
	}

	return {
		keyword: synonyms.shift(),
		synonyms: synonyms,
	};
};
