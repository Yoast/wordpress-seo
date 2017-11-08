import scoreToRating from "yoastseo/js/interpreters/scoreToRating";

/**
 * Mapped results definition
 * @typedef {Object} MappedResults
 * @property {Array} errorsResults
 * @property {Array} problemsResults
 * @property {Array} improvementsResults
 * @property {Array} goodResults
 * @property {Array} considerationsResults
 */

/**
 * Maps results to object, to be used by the ContentAnalysis component.
 *
 * @param {object} results Results returned by YoastSEO.js
 *
 * @returns {MappedResults}
 */
export default function mapResults( results ) {
	const mappedResults = {
		errorsResults: [],
		problemsResults: [],
		improvementsResults: [],
		goodResults: [],
		considerationsResults: [],
	};
	if( ! results ) {
		return mappedResults;
	}
	for( let i = 0; i < results.length; i++ ) {
		const result = results[ i ];
		if( ! result.text ) {
			continue;
		}
		result.rating = scoreToRating( result.score );
		result.hasMarks = result._hasMarks;
		result.marker = result._marker;
		result.id = result._identifier;
		switch ( result.rating ) {
			case "error":
				mappedResults.errorsResults.push( result );
				break;
			case "feedback":
				mappedResults.considerationsResults.push( result );
				break;
			case "bad":
				mappedResults.problemsResults.push( result );
				break;
			case "ok":
				result.rating = "OK";
				mappedResults.improvementsResults.push( result );
				break;
			case "good":
				mappedResults.goodResults.push( result );
				break;
			default:
				console.log( "Unmapped score" );
		}
	}
	console.log( mappedResults );
	return mappedResults;
}
