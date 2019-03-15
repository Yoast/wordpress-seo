/**
 * Get terms for a taxonomy.
 *
 * @param {object} state    State object.
 * @param {string} taxonomy The taxonomy's slug.
 *
 * @returns {object} Action object.
 */
export const getTerms = ( state, taxonomy ) => {
	return state.terms[ taxonomy ];
};
