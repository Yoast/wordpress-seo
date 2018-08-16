const PREFIX = "WPSEO_";

export const SET_PRIMARY_TAXONOMY = `${ PREFIX }SET_PRIMARY_TAXONOMY`;

export const setPrimaryTaxonomyId = (taxonomy, termId ) => {
	return {
		type: SET_PRIMARY_TAXONOMY,
		taxonomy,
		termId,
	};
};
