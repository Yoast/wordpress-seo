import scoreToRating from "../../../../src/interpreters/scoreToRating";

/**
 * Sorts analysis results alphabetically by their identifier.
 *
 * @param {Array} assessmentResults The assessment results to be sorted.
 *
 * @returns {Array} The sorted results.
 */
function sortResultsByIdentifier( assessmentResults ) {
	return assessmentResults.sort( ( a, b ) => a._identifier.localeCompare( b._identifier ) );
}

/**
 * Adapts the results to be used with our components.
 *
 * @param {Object} analyzeResults The original results object as received by the worker.
 *
 * @returns {Object} The results as wanted by the components.
 */
export default function formatAnalyzeResults( analyzeResults ) {
	if ( analyzeResults.seo ) {
		analyzeResults.seo[ "" ].results.forEach( result => {
			result.id = result._identifier;
			result.hasMarks = result.marks.length > 0;
			result.rating = scoreToRating( result.score );
		} );

		analyzeResults.seo[ "" ].results = sortResultsByIdentifier( analyzeResults.seo[ "" ].results );
	}

	if ( analyzeResults.readability ) {
		analyzeResults.readability.results.forEach( result => {
			result.id = result._identifier;
			result.hasMarks = result.marks.length > 0;
			result.rating = scoreToRating( result.score );
		} );

		analyzeResults.readability.results = sortResultsByIdentifier( analyzeResults.readability.results );
	}

	return analyzeResults;
}
