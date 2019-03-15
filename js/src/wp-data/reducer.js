/* global wpseoWpData */
const INITIAL_STATE = wpseoWpData || {};

import {
	SET_TERMS,
	SET_TAXONOMIES,
} from "./actions";

export default ( state = INITIAL_STATE, action ) => {
	switch ( action.type ) {
		case SET_TERMS:
			return {
				...state,
				terms: {
					...state.terms,
					[ action.taxonomy ]: action.terms,
				},
			};
		case SET_TAXONOMIES:
			return {
				...state,
				taxonomies: action.taxonomies,
			};
		default:
			return state;
	}
};
