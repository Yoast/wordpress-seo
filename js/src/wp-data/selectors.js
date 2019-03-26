/**
 * Get terms for a taxonomy.
 *
 * @param {Object} state    State object.
 * @param {string} taxonomy The taxonomy's slug.
 *
 * @returns {Object} Action object.
 */
export const getTerms = ( state, taxonomy ) => {
	return state.terms[ taxonomy ];
};

/**
 * Get the terms for the current post type.
 *
 * @param {Object} state State object.
 *
 * @returns {Object} Taxonomies object.
 */
export const getTaxonomies = ( state ) => {
	return state.taxonomies;
};

/**
 * Get the taxonomy for the given taxonomy's slug.
 *
 * @param {Object} state        State object.
 * @param {string} taxonomySlug Taxonomy slug.
 *
 * @returns {Object} Taxonomy object.
 */
export const getTaxonomy = ( state, taxonomySlug ) => {
	if ( ! state.taxonomies ) {
		return null;
	}

	return state.taxonomies[ taxonomySlug ];
};
