import {
	WINCHER_SET_SEO_PERFORMANCE_TRACKING,
	WINCHER_SET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE,
	WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES,
	WINCHER_TOGGLE_SEO_PERFORMANCE_TRACKING,
	WINCHER_UNSET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE,
	WINCHER_SET_TRACK_ALL_REQUEST,
} from "../actions";

import { pickBy } from "lodash-es";


const INITIAL_STATE = {
	isTracking: false,
	trackedKeyphrases: [],
	trackAll: false,
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
				...state,
				isTracking: action.isTracking,
			};
		case WINCHER_TOGGLE_SEO_PERFORMANCE_TRACKING:
			return {
				...state,
				isTracking: ! state.isTracking,
			};
		case WINCHER_SET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE:
			return {
				...state,
				trackedKeyphrases: { ...state.trackedKeyphrases, ...action.keyphraseObject },
			};
		case WINCHER_UNSET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE:
			return {
				...state,
				trackedKeyphrases: pickBy( state.trackedKeyphrases, ( value, key ) => {
					return key !== action.untrackedKeyphrase;
				} ),
			};
		case WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES:
			return {
				...state,
				trackedKeyphrases: action.trackedKeyphrases,
			};
	}
	return state;
}

export default WincherSEOPerformanceReducer;
