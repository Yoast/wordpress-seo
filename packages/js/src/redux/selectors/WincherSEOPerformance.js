import getL10nObject from "../../analysis/getL10nObject";

/**
 * Gets the current tracking status.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Current tracking status.
 */
export function getWincherIsTracking( state ) {
	return state.WincherSEOPerformance.isTracking;
}

/**
 * Gets the currently tracked keyphrases.
 *
 * @param {Object} state The state.
 *
 * @returns {array} The currently tracked keyphrases.
 */
export function getWincherTrackedKeyphrases( state ) {
	return state.WincherSEOPerformance.trackedKeyphrases;
}

/**
 * Determines whether any keyphrases are being tracked.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Whether keyphrases are being tracked.
 */
export function hasWincherTrackedKeyphrases( state ) {
	return state.WincherSEOPerformance.trackedKeyphrases.length !== 0;
}

/**
 * Gets the set keyphrases.
 *
 * @param {Object} state The state.
 *
 * @returns {array} The currently set keyphrases.
 */
export function getWincherTrackableKeyphrases( state ) {
	const isPremium = getL10nObject().isPremium;

	if ( isPremium ) {
		return [
			state.focusKeyword,
			...window.wp.data.select( "yoast-seo-premium/editor" ).getKeywords(),
		];
	}

	return [ state.focusKeyword ];
}

/**
 * Gets the chart data.
 *
 * @param {Object} state The state.
 *
 * @returns {array} The chart data.
 */
export function getWincherTrackedKeyphrasesChartData( state ) {
	return state.WincherSEOPerformance.chartData;
}

/**
 * Gets the chart data timestamp.
 *
 * @param {Object} state The state.
 *
 * @returns {number} The chart data timestamp.
 */
export function getWincherTrackedKeyphrasesChartDataTs( state ) {
	return state.WincherSEOPerformance.chartDataTs;
}
