/* eslint-disable complexity */
import { mergePathToState } from "@yoast/admin-ui-toolkit/helpers";
import { get, merge, omitBy } from "lodash";
import {
	ADD_RELATED_KEYPHRASE,
	GET_DETAIL_ERROR,
	GET_DETAIL_SUCCESS,
	REMOVE_RELATED_KEYPHRASE,
	RESET_DATA,
	RUN_ANALYSIS_SUCCESS,
	SET_ALL_DATA,
	SET_DATA,
	REPLACE_ARRAY_DATA,
	TOGGLE_DATA,
} from "../constants.js";
import { defaultInitialState } from "../initial-state";

/**
 * A reducer for the detail data in the state.
 *
 * @param {Object} state The state.
 * @param {Object} action The action.
 *
 * @returns {Object} The new state.
 */
export default function detailDataReducer( state, { type, payload } ) {
	let toggleState;

	switch ( type ) {
		case SET_ALL_DATA:
			return merge( {}, payload );
		case GET_DETAIL_SUCCESS:
			return merge( {}, payload.data );

		case SET_DATA:
			return mergePathToState( state, payload.path, payload.value );

		case REPLACE_ARRAY_DATA:
			return mergePathToState( state, payload.path, payload.value, { arrayMerge: "replace" } );

		case TOGGLE_DATA:
			toggleState = get( state, payload.path, null );
			if ( toggleState === null ) {
				console.warn( "You have supplied a non-existent path to the redux action: ", payload.path );
				return state;
			}
			return mergePathToState( state, payload.path, ! toggleState );

		case RESET_DATA:
		case GET_DETAIL_ERROR:
			return defaultInitialState.detail.data;

		case RUN_ANALYSIS_SUCCESS:
			return {
				...state,
				scores: {
					readability: payload.readability.score,
					seo: payload.seo.score,
				},
			};

		case ADD_RELATED_KEYPHRASE:
			return {
				...state,
				keyphrases: {
					...state.keyphrases,
					related: {
						...state.keyphrases.related,
						[ payload.key ]: payload.keyphrase,
					},
				},
			};
		case REMOVE_RELATED_KEYPHRASE:
			// Removes the data related to the keyphrase, the keyphrase and its synonyms.
			return {
				...state,
				keyphrases: {
					...state.keyphrases,
					related: omitBy( state.keyphrases.related, ( keyphrase, key ) => key === payload ),
					synonyms: omitBy( state.keyphrases.synonyms, ( keyphrase, key ) => key === payload ),
				},
			};

		default:
			return state;
	}
}
