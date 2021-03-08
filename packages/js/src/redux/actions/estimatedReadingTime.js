import EstimatedReadingTimeFields from "../../helpers/fields/EstimatedReadingTimeFields";

export const SET_ESTIMATED_READING_TIME = "SET_ESTIMATED_READING_TIME";
export const LOAD_ESTIMATED_READING_TIME = "LOAD_ESTIMATED_READING_TIME";

/**
 * Sets the estimated reading time to the store
 *
 * @param {Object} estimatedReadingTime The estimated reading time from the researcher.
 *
 * @returns {Object} The SET_ESTIMATED_READING_TIME action.
 */
export function setEstimatedReadingTime( estimatedReadingTime ) {
	EstimatedReadingTimeFields.estimatedReadingTime = estimatedReadingTime;
	return {
		type: SET_ESTIMATED_READING_TIME,
		estimatedReadingTime,
	};
}

/**
 * Loads the Estimated Reading Time from the hidden field to the store.
 *
 * @returns {Object} The LOAD_ESTIMATED_READING_TIME action
 */
export function loadEstimatedReadingTime() {
	return {
		type: LOAD_ESTIMATED_READING_TIME,
		estimatedReadingTime: EstimatedReadingTimeFields.estimatedReadingTime,
	};
}
