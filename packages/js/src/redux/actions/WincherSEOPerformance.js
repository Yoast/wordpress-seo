import WincherSEOAnalysisFields from "../../helpers/fields/WincherSEOAnalysisFields";

export const WINCHER_TOGGLE_SEO_PERFORMANCE_TRACKING = "WINCHER_TOGGLE_SEO_PERFORMANCE_TRACKING";
export const WINCHER_SET_SEO_PERFORMANCE_TRACKING = "WINCHER_SET_SEO_PERFORMANCE_TRACKING";

export const WINCHER_SET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE = "WINCHER_SET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE";
export const WINCHER_UNSET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE = "WINCHER_UNSET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE";

export const WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES = "WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES";
export const WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES_CHART_DATA = "WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES_CHART_DATA";

/**
 * An action creator for loading the Wincher SEO tracking.
 *
 * @returns {Object} The Wincher SEO tracking. action.
 */
export const loadWincherKeyphraseTracking = () => {
	return {
		type: WINCHER_SET_SEO_PERFORMANCE_TRACKING,
		isTracking: WincherSEOAnalysisFields.isTracking,
	};
};

/**
 * Sets the tracking toggle for the current article.
 *
 * @param {boolean} isTracking Whether or not tracking is enabled for this article.
 *
 * @returns {Object} Action object.
 */
export function setWincherKeyphraseTracking( isTracking ) {
	return {
		type: WINCHER_SET_SEO_PERFORMANCE_TRACKING,
		isTracking,
	};
}

/**
 * Toggles the tracking of the article.
 *
 * @returns {Object} Action object.
 */
export function toggleKeyphraseTracking() {
	return {
		type: WINCHER_TOGGLE_SEO_PERFORMANCE_TRACKING,
	};
}

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
