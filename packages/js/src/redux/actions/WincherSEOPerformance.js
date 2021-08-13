import AnalysisFields from "../../helpers/fields/AnalysisFields";

export const WINCHER_TOGGLE_SEO_PERFORMANCE_TRACKING = "WINCHER_TOGGLE_SEO_PERFORMANCE_TRACKING";
export const WINCHER_SET_SEO_PERFORMANCE_TRACKING = "WINCHER_SET_SEO_PERFORMANCE_TRACKING";

export const WINCHER_TOGGLE_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE = "WINCHER_TOGGLE_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE";
export const WINCHER_SET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE = "WINCHER_ET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE";

export const WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES = "WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES";

/**
 * Sets the tracking toggle for the current article.
 *
 * @param {boolean} isTracking Whether or not tracking is enabled for this article.
 *
 * @returns {Object} Action object.
 */
export function setWincherKeyphraseTracking( isTracking ) {
	// AnalysisFields.isTracking = isTracking;

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
 * Toggles the tracking of a specific keyphrase for the current article.
 *
 * @param {string} trackableKeyphrase The keyphrase that can be tracked.
 *
 * @returns {Object} Action object.
 */
export function toggleTrackingForKeyphrase( trackableKeyphrase ) {
	return {
		type: WINCHER_TOGGLE_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE,
		trackableKeyphrase,
	};
}

/**
 * Sets the tracking toggle of a specific keyphrase for the current article.
 *
 * @param {string} trackableKeyphrase The keyphrase that can be tracked.
 * @param {boolean} isTrackingKeyphrase Whether or not the keyphrase is being tracked..
 *
 * @returns {Object} Action object.
 */
export function setTrackingForKeyphrase( trackableKeyphrase, isTrackingKeyphrase ) {
	return {
		type: WINCHER_SET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE,
		trackableKeyphrase,
		isTrackingKeyphrase,
	};
}

/**
 * Sets the keyphrases that are being tracked for the current article.
 *
 * @param {array} trackedKeyphrases The keyphrases that are being tracked.
 *
 * @returns {Object} Action object.
 */
export function setTrackedKeyphrases( trackedKeyphrases ) {
	return {
		type: WINCHER_SET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE,
		trackedKeyphrases,
	};
}
