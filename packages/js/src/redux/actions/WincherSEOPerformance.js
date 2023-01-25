export const WINCHER_SET_WEBSITE_ID = "WINCHER_SET_WEBSITE_ID";

export const WINCHER_SET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE = "WINCHER_SET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE";
export const WINCHER_UNSET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE = "WINCHER_UNSET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE";

export const WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES = "WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES";

/**
 * Sets the current website id.
 *
 * @param {String} websiteId The website id.
 *
 * @returns {Object} Action object.
 */
export function setWincherWebsiteId( websiteId ) {
	return {
		type: WINCHER_SET_WEBSITE_ID,
		websiteId,
	};
}

/**
 * Sets the tracking of a specific keyphrase for the current article.
 *
 * @param {Object} keyphraseObject The keyphrase data object to use.
 *
 * @returns {Object} Action object.
 */
export function setWincherTrackingForKeyphrase( keyphraseObject ) {
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
export function unsetWincherTrackingForKeyphrase( untrackedKeyphrase ) {
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
export function setWincherTrackedKeyphrases( trackedKeyphrases ) {
	return {
		type: WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES,
		trackedKeyphrases,
	};
}
