/* External dependencies */
import { isEmpty, filter, uniq } from "lodash-es";

/* Internal dependencies */
import getL10nObject from "../../analysis/getL10nObject";
import { getAnalysisData } from "./analysis";

/**
 * Gets the current website id.
 *
 * @param {Object} state The state.
 *
 * @returns {String} The current website id.
 */
export function getWincherWebsiteId( state ) {
	return state.WincherSEOPerformance.websiteId;
}

/**
 * Gets the currently tracked keyphrases.
 *
 * @param {Object} state The state.
 *
 * @returns {Object|null} The currently tracked keyphrases.
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
	const tracked = Object.keys( getWincherTrackedKeyphrases( state ) || {} ).map( k => k.trim() );
	const keyphrases = [ state.focusKeyword.trim(), ...tracked ];

	if ( isPremium && premiumStore ) {
		keyphrases.push( ...premiumStore.getKeywords().map( k => k.keyword.trim() ) );
	}

	return uniq( keyphrases.filter( k => !! k ).map(
		// Canonicalize the keyword the same way Wincher does
		k => k
			.replace( /["+:\s]+/g, " " )
			.trim()
			.toLocaleLowerCase()
	) ).sort();
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
		return isEmpty( trackedKeyphrase.updated_at );
	} );

	return withoutRanking.length === Object.keys( trackedKeyphrases ).length;
}

/**
 * Returns the current permalink for the the edited post.
 *
 * @param {Object} state The state.
 *
 * @returns {String} The permalink of the post or empty if not ready yet.
 */
export function getWincherPermalink( state ) {
	const analysisData = getAnalysisData( state );

	// Workaround for the fact that analysisData.permalink is initialized before the slug is ready.
	if ( ! analysisData.slug ) {
		return "";
	}

	return analysisData.permalink;
}
