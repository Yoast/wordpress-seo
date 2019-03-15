export const PREFIX = "WPSEO_WP_DATA_";

export const SET_TERMS      = `${ PREFIX }SET_TERMS`;
export const SET_TAXONOMIES = `${ PREFIX }SET_TAXONOMIES`;
export const FETCH_FROM_API = `${ PREFIX }FETCH_FROM_API`;

/**
 * Update a list of terms in the store for a given taxonomy.
 *
 * @param {string} taxonomy Taxonomy slug.
 * @param {array}  terms    List of terms.
 *
 * @returns {object} Action object.
 */
export function setTerms( { taxonomySlug, terms } ) {
	return {
		type: SET_TERMS,
		taxonomy: taxonomySlug,
		terms,
	};
}

/**
 * Update a list of taxonomies in the store.
 *
 * @param {array} taxonomies Array of taxonomies for current post.
 *
 * @returns {object} Action object.
 */
export function setTaxonomies( taxonomies ) {
	return {
		type: SET_TAXONOMIES,
		taxonomies,
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
