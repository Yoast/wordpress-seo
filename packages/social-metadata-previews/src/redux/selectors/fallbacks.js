import { get } from "lodash";
import { getTwitterTitle, getFacebookTitle } from "./socialPreview";

/**
 * Loops over the fallbackPaths of a key and returns the first available result.
 *
 * @param {Array} fallbackPaths The paths within the state, to fallback to.
 *
 * @returns {Function} A selector for fallbacks.
 */
const createFallbackSelector = ( fallbackPaths ) => {
	return ( state ) => {
		console.log( "state", state );
		for ( const fallbackPath of fallbackPaths ) {
			const result = get( state, fallbackPath );
			if ( result ) {
				return result;
			}
		}
	};
};

const FACEBOOK_FALLBACK_PATHS = {
	title: [ "snippetEditor.title" ],
	description: [],
};

/**
 * Loops over the fallbackPaths of a key and returns the first available result.
 *
 * @param {Object} state The paths within the state, to fallback to.
 * @param {String} key The paths within the state, to fallback to.
 *
 * @returns {Function} A selector for fallbacks.
 */
export const getFacebookTitleFallback = createFallbackSelector( FACEBOOK_FALLBACK_PATHS.title );


