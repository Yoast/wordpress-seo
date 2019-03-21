import scoreToRating from "yoastsrc/interpreters/scoreToRating";

/**
 * Sorts analysis results by score and then alphabetically by their identifier.
 *
 * @param {Array} assessmentResults The assessment results to be sorted.
 *
 * @returns {Array} The sorted results.
 */
function sortResults( assessmentResults ) {
	return assessmentResults.sort( ( a, b ) => {
		// First compare the score.
		if ( a.score < b.score ) {
			return -1;
		}
		if ( a.score > b.score ) {
			return 1;
		}

		// If there is no difference then compare the id.
		return a.id.localeCompare( b.id );
	} );
}

/**
 * Maps a single results to a result that can be interpreted by the AnalysisList component.
 *
 * @param {object} result Result provided by the worker.
 *
 * @returns {Object} The mapped result.
 */
function mapResult( result ) {
	result.id = result.getIdentifier();
	result.rating = scoreToRating( result.score );
	result.hasMarks = result.hasMarks();
	result.marker = result.getMarker();

	// Because of inconsistency between YoastSEO and yoast-components.
	if ( result.rating === "ok" ) {
		result.rating = "OK";
	}

	return result;
}

/**
 * Maps results to a results that can be interpreted by the AnalysisList component.
 *
 * @param {object} results Results provided by the worker.
 *
 * @returns {Array} The mapped results.
 */
function mapResults( results ) {
	const mappedResults = [];

	for ( let i = 0; i < results.length; i++ ) {
		if ( ! results[ i ].text ) {
			continue;
		}
		mappedResults.push( mapResult( results[ i ] ) );
	}

	return sortResults( mappedResults );
}

/**
 * Adapts the results to be used with our components.
 *
 * @param {Object} analyzeResults The original results object as received by the worker.
 * @param {String} keyphraseId The id of the keyphrase to show (e.g. when analyzing relevant keyphrase).
 *
 * @returns {Object} The results as wanted by the components.
 */
export default function formatAnalyzeResults( analyzeResults, keyphraseId ) {
	if ( analyzeResults.seo ) {
		analyzeResults.seo[ "" ].results = mapResults( analyzeResults.seo[ keyphraseId ].results );
	}

	if ( analyzeResults.readability ) {
		analyzeResults.readability.results = mapResults( analyzeResults.readability.results );
	}

	return analyzeResults;
}
