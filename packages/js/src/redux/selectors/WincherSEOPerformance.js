/* External dependencies */
import { isEmpty, filter } from "lodash-es";

/* Internal dependencies */
import getL10nObject from "../../analysis/getL10nObject";

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
	return ! isEmpty( state.WincherSEOPerformance.trackedKeyphrases );
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
	const premiumStore = window.wp.data.select( "yoast-seo-premium/editor" );
	const keyphrases = [ state.focusKeyword.trim() ];

	if ( isPremium && premiumStore ) {
		keyphrases.push( ...premiumStore.getKeywords().map( k => k.keyword.trim() ) );
	}

	return keyphrases.filter( k => !! k );
}

/**
 * Gets the chart data.
 *
 * @param {Object} state The state.
 *
 * @returns {array} The chart data.
 */
export function getWincherChartData( state ) {
	return state.WincherSEOPerformance.chartData;
}

/**
 * Gets the chart data timestamp.
 *
 * @param {Object} state The state.
 *
 * @returns {number} The chart data timestamp.
 */
export function getWincherChartDataTs( state ) {
	return state.WincherSEOPerformance.chartDataTs;
}

/**
 * Determines whether all keyphrases being tracked are still missing ranking data.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Whether all keyphrases being tracked are missing ranking data.
 */
export function getWincherAllKeyphrasesMissRanking( state ) {
	const { trackedKeyphrases } = state.WincherSEOPerformance;

	if ( isEmpty( trackedKeyphrases ) ) {
		return false;
	}

	const withoutRanking = filter( trackedKeyphrases, ( trackedKeyphrase ) => {
		return isEmpty( trackedKeyphrase.ranking_updated_at );
	} );

	return withoutRanking.length === Object.keys( trackedKeyphrases ).length;
}
