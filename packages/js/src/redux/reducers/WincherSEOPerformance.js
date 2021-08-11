import {
	WINCHER_SET_SEO_PERFORMANCE_TRACKING,
	WINCHER_TOGGLE_KEYPHRASE_TRACKING,
	WINCHER_SET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE,
	WINCHER_TOGGLE_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE, WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES,
} from "../actions";

import { xor } from "lodash-es";


const INITIAL_STATE = {
	isTracking: false,
	trackedKeyphrases: [],
};
/**
 * A reducer for the Wincher SEO Performance feature..
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The received action.
 *
 * @returns {Object} The state.
 */
function WincherSEOPerformanceReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case WINCHER_SET_SEO_PERFORMANCE_TRACKING:
			return {
				isTracking: action.isTracking,
			};
		case WINCHER_TOGGLE_KEYPHRASE_TRACKING:
			return {
				isTracking: ! state.isTracking,
			};
		case WINCHER_SET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE:
			return {
				trackableKeyphrase: action.trackableKeyphrase,
			};
		case WINCHER_TOGGLE_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE:
			return {
				trackedKeyphrases: xor( state.trackedKeyphrases, [ action.trackableKeyphrase ] ),
			};
		case WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES:
			return {
				trackedKeyphrases: [ action.trackedKeyphrases ],
			};
	}
	return state;
}

export default WincherSEOPerformanceReducer;
