/**
 * Get terms for a taxonomy.
 *
 * @param {Object} state    State object.
 * @param {string} taxonomy The taxonomy's slug.
 *
 * @returns {object} Action object.
 */
export const getTerms = ( state, taxonomy ) => {
	return state.terms[ taxonomy ];
};

/**
 * Get the terms for the current post type.
 *
 * @param {object} state State object.
 *
 * @returns {object} Taxonomies object.
 */
export const getTaxonomies = ( state ) => {
	return state.taxonomies;
};

/**
 * Get the taxonomy for the given taxonomy's slug.
 *
 * @param {object} state        State object.
 * @param {string} taxonomySlug Taxonomy slug.
 *
 * @returns {object} Taxonomy object.
 */
export const getTaxonomy = ( state, taxonomySlug ) => {
	if ( ! state.taxonomies ) {
		return null;
	}

	return state.taxonomies[ taxonomySlug ];
};
