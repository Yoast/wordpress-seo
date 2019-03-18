/* global wpseoWpData */
import { SET_TAXONOMIES } from "../actions";

export default ( state = wpseoWpData.taxonomies, action ) => {
	switch ( action.type ) {
		case SET_TAXONOMIES:
			return action.taxonomies;
		default:
			return state;
	}
};
