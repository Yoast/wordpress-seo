/* global wpseoWpData */
const INITIAL_STATE = wpseoWpData || {};

import {
	SET_TERMS,
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
		default:
			return state;
	}
};
