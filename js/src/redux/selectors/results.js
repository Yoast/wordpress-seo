import get from "lodash/get";

/**
 *
 * @param state
 * @returns {*}
 */
export function getSeoResults( state ) {
	return get( state, [ "analysis", "seo" ], {} );
}

export function getActiveKeyword( state ) {
	return state.activeKeyword;
}

export function getResultsForKeyword( state, keyword ) {
	const seoResults = getSeoResults( state );

	return get( seoResults, keyword, [] );
}


