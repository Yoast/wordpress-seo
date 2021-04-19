import { get } from "lodash";

/**
 * Gets the Estimated Reading Time from the store.
 *
 * @param {Object} state The state.
 *
 * @returns {Number} The estimated reading time.
 */
export function getEstimatedReadingTime( state ) {
	return get( state, "estimatedReadingTime.estimatedReadingTime", 0 ) || 0;
}
