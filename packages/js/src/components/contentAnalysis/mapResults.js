import { interpreters } from "yoastseo";
import { colors } from "@yoast/style-guide";

/**
 * Mapped result definition.
 * @typedef {Object} MappedResult
 * @property {string} rating
 * @property {bool} hasMarks
 * @property {string} text
 * @property {string} id
 * @property {func} marker
 * @property {number} score
 * @property {string} markerId
 */

/**
 * Mapped results definition.
 * @typedef {Object} MappedResults
 * @property {Array<MappedResult>} errorsResults
 * @property {Array<MappedResult>} problemsResults
 * @property {Array<MappedResult>} improvementsResults
 * @property {Array<MappedResult>} goodResults
 * @property {Array<MappedResult>} considerationsResults
 */

/**
 * Maps a single results to a result that can be interpreted by yoast-component's ContentAnalysis.
 *
 * @param {object} result Result provided by YoastSEO.js.
 * @param {string} key    The keyword key to use for the marker id.
 *
 * @returns {MappedResult} The mapped result.
 */
function mapResult( result, key = "" ) {
	const id = result.getIdentifier();
	const mappedResult = {
		score: result.score,
		rating: interpreters.scoreToRating( result.score ),
		hasMarks: result.hasMarks(),
		marker: result.getMarker(),
		id,
		text: result.text,
		markerId: key.length > 0 ? `${key}:${id}` : id,
	};

	// Because of inconsistency between YoastSEO and yoast-components.
	if ( mappedResult.rating === "ok" ) {
		mappedResult.rating = "OK";
	}

	return mappedResult;
}

/**
 * Adds a mapped results to the appropriate array in the mapped results object.
 *
 * @param {MappedResult} mappedResult The mapped result.
 * @param {MappedResults} mappedResults The mapped results.
 *
 * @returns {MappedResults} The mapped results object with the added result.
 */
function processResult( mappedResult, mappedResults ) {
	switch ( mappedResult.rating ) {
		case "error":
			mappedResults.errorsResults.push( mappedResult );
			break;
		case "feedback":
			mappedResults.considerationsResults.push( mappedResult );
			break;
		case "bad":
			mappedResults.problemsResults.push( mappedResult );
			break;
		case "OK":
			mappedResults.improvementsResults.push( mappedResult );
			break;
		case "good":
			mappedResults.goodResults.push( mappedResult );
			break;
	}
	return mappedResults;
}

/**
 * Retrieves the icons and colors for the icon for a certain result.
 *
 * @param {string} score The score for which to return the icon and color.
 *
 * @returns {Object} The icon and color for the score.
 */
export function getIconForScore( score ) {
	let icon = { icon: "seo-score-none", color: colors.$color_red };

	switch ( score ) {
		case "loading":
			icon = { icon: "loading-spinner", color: colors.$color_green_medium_light };
			break;
		case "not-set":
			icon = { icon: "seo-score-none", color: colors.$color_grey };
			break;
		case "good":
			icon = { icon: "seo-score-good", color: colors.$color_green_medium };
			break;
		case "ok":
			icon = { icon: "seo-score-ok", color: colors.$color_ok };
			break;
		case "bad":
			icon = { icon: "seo-score-bad", color: colors.$color_red };
			break;
	}

	return icon;
}

/**
 * Maps results to object, to be used by the ContentAnalysis component.
 *
 * Takes in the YoastSEO.js results and maps them to the appropriate objects, so they can be used by the
 * ContentAnalysis component from @yoast/analysis-report.
 *
 * @param {object} results    Results provided by YoastSEO.js.
 * @param {string} keywordKey The key of the keyword that these results represent.
 *
 * @returns {MappedResults} The mapped results.
 */
export default function mapResults( results, keywordKey = "" ) {
	let mappedResults = {
		errorsResults: [],
		problemsResults: [],
		improvementsResults: [],
		goodResults: [],
		considerationsResults: [],
	};
	if ( ! results ) {
		return mappedResults;
	}
	for ( let i = 0; i < results.length; i++ ) {
		const result = results[ i ];
		if ( ! result.text ) {
			continue;
		}
		const mappedResult = mapResult( result, keywordKey );
		mappedResults = processResult( mappedResult, mappedResults );
	}
	return mappedResults;
}
