/* External dependencies */
import { isEmpty, filter, uniq } from "lodash";

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
 * Gets keyphrases from the premium store, if the premium store is available.
 *
 * @returns {string[]} The premium keyphrases, or an empty array.
 */
function getPremiumKeyphrases() {
	const premiumStore = window.wp?.data?.select( "yoast-seo-premium/editor" );
	if ( ! getL10nObject().isPremium || ! premiumStore ) {
		return [];
	}
	// eslint-disable-next-line no-undefined
	return premiumStore.getKeywords().filter( k => k.keyword !== undefined ).map( k => k.keyword.trim() );
}

/**
 * Creates a memoized selector for trackable keyphrases.
 *
 * Uses output memoization: returns the same array reference whenever the
 * computed content has not changed. This prevents `useSelect`/`withSelect`
 * from seeing a new reference on every render, which would cause unnecessary
 * re-renders. A simple `createSelector` approach is not sufficient here because
 * the premium store is external and may return a new array reference on every
 * call even when its content is unchanged.
 *
 * @returns {Function} A memoized selector that takes state and returns an array of keyphrases.
 */
export const makeGetWincherTrackableKeyphrases = () => {
	let lastResult = [];

	return ( state ) => {
		const keyphrases = [ state.focusKeyword.trim(), ...getPremiumKeyphrases() ];

		const result = uniq( keyphrases.filter( k => !! k ).map(
			// Canonicalize the keyword the same way Wincher does
			k => k
				.replace( /["+:\s]+/g, " " )
				.trim()
				.toLocaleLowerCase()
		) ).sort();

		// Return the previous reference when content is identical to avoid triggering re-renders.
		if ( result.length === lastResult.length && result.every( ( v, i ) => v === lastResult[ i ] ) ) {
			return lastResult;
		}

		lastResult = result;
		return result;
	};
};

/**
 * Gets the set keyphrases that can be tracked by Wincher.
 *
 * @param {Object} state The state.
 *
 * @returns {string[]} The canonicalized, deduplicated, sorted list of trackable keyphrases.
 */
export const getWincherTrackableKeyphrases = makeGetWincherTrackableKeyphrases();

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
