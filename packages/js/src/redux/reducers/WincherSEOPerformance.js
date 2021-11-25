import {
	WINCHER_SET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE,
	WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES,
	WINCHER_UNSET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE,
	WINCHER_SET_WEBSITE_ID,
} from "../actions";

import { pickBy } from "lodash-es";

const INITIAL_STATE = {
	websiteId: "",
	trackedKeyphrases: null,
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
		case WINCHER_SET_WEBSITE_ID:
			return {
				...state,
				websiteId: action.websiteId,
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
