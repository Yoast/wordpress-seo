const PREFIX = "WPSEO_";

export const SET_PRIMARY_CATEGORY = `${ PREFIX }SET_PRIMARY_CATEGORY`;

export const setPrimaryCategory = ( primaryCategory ) => {
	return {
		type: SET_PRIMARY_CATEGORY,
		primaryCategory,
	};
};
