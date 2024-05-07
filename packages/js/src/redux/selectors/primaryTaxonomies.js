import { get } from "lodash";
/**
 * Gets the primary taxonomy term id for the give taxonomy.
 *
 * @param {Object} state    The state.
 * @param {string} taxonomy The primary taxonomy to retrieve.
 *
 * @returns {number} Primary taxonomy term id.
 */
export function getPrimaryTaxonomyId( state, taxonomy ) {
	return get( state, `primaryTaxonomies.${taxonomy}`, -1 );
}

/**
 * Gets all the primary taxonomies term ids.
 *
 * @param {Object} state    The state.
 *
 * @returns {object} Primary taxonomy term id.
 */
export function getPrimaryTaxonomies( state ) {
	return get( state, "primaryTaxonomies", {} );
}
