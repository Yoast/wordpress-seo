import {
	WINCHER_SET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE,
	WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES,
	WINCHER_UNSET_SEO_PERFORMANCE_TRACKING_FOR_KEYPHRASE,
	WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES_CHART_DATA,
} from "../actions";

import { pickBy } from "lodash-es";

const INITIAL_STATE = {
	trackedKeyphrases: {},
	trackAll: false,
	chartData: {},
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
		case WINCHER_SET_SEO_PERFORMANCE_TRACKED_KEYPHRASES_CHART_DATA:
			return {
				...state,
				chartData: action.chartData,
			};
	}
	return state;
}

export default WincherSEOPerformanceReducer;
