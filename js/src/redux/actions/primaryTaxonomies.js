const PREFIX = "WPSEO_";

export const SET_PRIMARY_TAXONOMY = `${ PREFIX }SET_PRIMARY_TAXONOMY`;

/**
 * Redux action creator to set the primary taxonomy ID.
 *
 * @param {string} taxonomy The taxonomy.
 * @param {string} termId The term ID.
 *
 * @returns {object} The action.
 */
export const setPrimaryTaxonomyId = ( taxonomy, termId ) => {
	return {
		type: SET_PRIMARY_TAXONOMY,
		taxonomy,
		termId,
	};
};
