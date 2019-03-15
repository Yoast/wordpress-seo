export const PREFIX = "WPSEO_WP_DATA_";

export const SET_TERMS = `${ PREFIX }SET_TERMS`;
export const FETCH_FROM_API = `${ PREFIX }FETCH_FROM_API`;

/**
 * Update a list of terms in the store for a given taxonomy.
 *
 * @param {string} taxonomy Taxonomy slug.
 * @param {array}  terms    List of terms.
 *
 * @returns {object} Action object.
 */
export function setTerms( { taxonomy, terms } ) {
	return {
		type: SET_TERMS,
		taxonomy,
		terms,
	};
}

/**
 * Action used by the FETCH_FROM_API control. See ./controls.js.
 *
 * @param {object} request Arguments for apiFetch.
 *
 * @returns {object} Action object.
 */
export function fetchFromAPI( request ) {
	return {
		type: FETCH_FROM_API,
		request,
	};
}
