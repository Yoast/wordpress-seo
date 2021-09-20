import { ASYNC_STATUS } from "@yoast/admin-ui-toolkit/constants";
import { omitBy, tail, takeRight } from "lodash";
import {
	ADD_RELATED_KEYPHRASE,
	GET_DETAIL_SUCCESS,
	REMOVE_RELATED_KEYPHRASE,
	RUN_RELATED_KEYPHRASE_ANALYSIS_ERROR,
	RUN_RELATED_KEYPHRASE_ANALYSIS_REQUEST,
	RUN_RELATED_KEYPHRASE_ANALYSIS_SUCCESS,
	SET_ALL_DATA,
} from "../constants";

export const DEFAULT_KEYPHRASE_KEYS = [
	"a",
	"b",
	"c",
	"d",
];

/**
 * Reduces the related keyphrases state.
 *
 * The available keys are meant to bind our rendered inputs to the data. This way, when a user removes one of the
 * related keyphrase inputs, it will keep the cursor and focus where it was. And we can safely remove an input field
 * above or below the currently focused one.
 *
 * @param {Object} state  The state.
 * @param {Object} action The action.
 *
 * @returns {Object} The new state.
 */
export default function relatedReducer( state, { type, payload } ) {
	let availableKeys;

	switch ( type ) {
		case SET_ALL_DATA:
			/*
			 * Only take the keys still available, we need to remove an amount from the
			 * beginning of the array based on how many keyphrases are in the store.
			 */
			availableKeys = DEFAULT_KEYPHRASE_KEYS.length - ( Object.keys( payload.keyphrases.related ).length || 0 );

			return {
				...state,
				availableKeys: takeRight( state.availableKeys, availableKeys ),
			};
		case GET_DETAIL_SUCCESS:
			/*
			 * Only take the keys still available, we need to remove an amount from the
			 * beginning of the array based on how many keyphrases are in the store.
			 */
			availableKeys = DEFAULT_KEYPHRASE_KEYS.length - ( Object.keys( payload.data.keyphrases.related ).length || 0 );

			return {
				...state,
				availableKeys: takeRight( state.availableKeys, availableKeys ),
			};

		case ADD_RELATED_KEYPHRASE:
			return {
				...state,
				// First available key should be removed, because it is now used.
				availableKeys: tail( state.availableKeys ),
			};

		case REMOVE_RELATED_KEYPHRASE:
			// Remove the results for the removed keyphrase.
			return omitBy( {
				...state,
				// The removed keyphrase should be the first one available so we can preserve focus on the input field.
				availableKeys: [
					payload,
					...state.availableKeys,
				],
			}, relatedKeyphrase => relatedKeyphrase.key === payload );

		case RUN_RELATED_KEYPHRASE_ANALYSIS_REQUEST:
			return {
				...state,
				status: ASYNC_STATUS.loading,
			};
		case RUN_RELATED_KEYPHRASE_ANALYSIS_SUCCESS:
			return {
				...state,
				status: ASYNC_STATUS.success,
				...payload,
			};
		case RUN_RELATED_KEYPHRASE_ANALYSIS_ERROR:
			return {
				...state,
				status: ASYNC_STATUS.error,
			};

		default:
			return state;
	}
}
