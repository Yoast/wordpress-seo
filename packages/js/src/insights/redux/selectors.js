import { get } from "lodash";

// Empty in const so that no change will be detected.
const emptyObject = {};

/**
 * Gets the Estimated Reading Time from the store.
 *
 * @param {Object} state The state.
 *
 * @returns {number} The estimated reading time.
 */
export const getEstimatedReadingTime = state => get( state, "insights.estimatedReadingTime", 0 );

/**
 * @param {Object} state The state.
 *
 * @returns {number} The flesch reading ease score.
 */
export const getFleschReadingEaseScore = state => get( state, "insights.fleschReadingEaseScore", 0 );

/**
 * @param {Object} state The state.
 *
 * @returns {string} The flesch reading ease text.
 */
export const getFleschReadingEaseText = state => {
	const result = get( state, "analysis.readability.results.0", emptyObject );
	if ( result?._identifier !== "fleschReadingEase" ) {
		// Replace the rest of the code with the line below when the assessment is moved out of the analysis worker.
		return get( state, "insights.fleschReadingEaseText", "" );
	}
	return result.text.replace( /^<a href='https:\/\/yoa.st\/34r[^>]*>Flesch Reading Ease<\/a>: /i, "" ).replace( /<a[^>]+>/gi, "<a>" );
};

/**
 * @param {Object} state The state.
 *
 * @returns {string} The word count.
 */
export const getWordCount = state => get( state, "insights.wordCount", "" );
