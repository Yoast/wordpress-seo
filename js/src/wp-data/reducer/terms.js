/* global wpseoWpData */
import {
	SET_TERMS,
} from "../actions";

export default ( state = wpseoWpData.terms, action ) => {
	switch ( action.type ) {
		case SET_TERMS:
			return {
				...state,
				[ action.taxonomy ]: action.terms,
			};
		default:
			return state;
	}
};
