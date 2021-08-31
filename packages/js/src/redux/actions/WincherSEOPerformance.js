export const WINCHER_SET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE = "WINCHER_SET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE";
export const WINCHER_UNSET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE = "WINCHER_UNSET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE";

export const WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES = "WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES";
export const WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES_CHART_DATA = "WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES_CHART_DATA";

/**
 * Sets the tracking of a specific keyphrase for the current article.
 *
 * @param {Object} keyphraseObject The keyphrase data object to use.
 *
 * @returns {Object} Action object.
 */
export function setTrackingForKeyphrase( keyphraseObject ) {
	return {
		type: WINCHER_SET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE,
		keyphraseObject,
	};
}

/**
 * Unsets the tracking of a specific keyphrase for the current article.
 *
 * @param {string} untrackedKeyphrase The keyphrase that is untracked.
 *
 * @returns {Object} Action object.
 */
export function unsetTrackingForKeyphrase( untrackedKeyphrase ) {
	return {
		type: WINCHER_UNSET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE,
		untrackedKeyphrase,
	};
}

/**
 * Sets the keyphrases that are being tracked for the current article.
 *
 * @param {Object} trackedKeyphrases The keyphrases that are being tracked.
 *
 * @returns {Object} Action object.
 */
export function setTrackedKeyphrases( trackedKeyphrases ) {
	return {
		type: WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES,
		trackedKeyphrases,
	};
}

/**
 * Sets the keyphrases that are being tracked for the current article.
 *
 * @param {Object} chartData The chart Data for the tracked keyphrases.
 *
 * @returns {Object} Action object.
 */
export function setTrackedKeyphrasesChartData( chartData ) {
	return {
		type: WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES_CHART_DATA,
		chartData,
	};
}
