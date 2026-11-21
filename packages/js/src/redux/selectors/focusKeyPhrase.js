import { applyFilters } from "@wordpress/hooks";
import { get, isArray, isString } from "lodash";

/**
 * Gets the focus keyphrase.
 *
 * @param {Object} state    The state.
 *
 * @returns {string} Focus keyphrase.
 */
export function getFocusKeyphrase( state ) {
	return get( state, "focusKeyword", "" );
}

/**
 * Creates a memoized selector for focus keyphrase errors.
 *
 * Uses output memoization: always calls `applyFilters` (so filter handlers that
 * maintain their own internal state, e.g. `hasInteractedWithFeature`, are never
 * skipped), but returns the previous array reference when the resulting error
 * strings are identical. This prevents `useSelect`/`withSelect` from seeing a
 * new reference on every render when nothing has actually changed.
 *
 * @returns {Function} A memoized selector that takes state and returns an array of error strings.
 */
const makeFocusKeyphraseErrors = () => {
	let lastResult = [];

	return ( state ) => {
		const errors = applyFilters( "yoast.focusKeyphrase.errors", [], getFocusKeyphrase( state ) );
		const result = isArray( errors ) ? errors.filter( isString ) : [];

		// Return the previous reference when content is identical to avoid triggering re-renders.
		if ( result.length === lastResult.length && result.every( ( v, i ) => v === lastResult[ i ] ) ) {
			return lastResult;
		}

		lastResult = result;
		return result;
	};
};

/**
 * Gets extra focus keyphrase errors.
 *
 * @param {Object} state The state.
 *
 * @returns {string[]} The errors.
 */
export const getFocusKeyphraseErrors = makeFocusKeyphraseErrors();
