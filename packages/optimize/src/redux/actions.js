import { select } from "@wordpress/data";
import { HANDLE_ROUTE_CHANGED_ERROR, HANDLE_ROUTE_CHANGED_REQUEST, HANDLE_ROUTE_CHANGED_SUCCESS } from "@yoast/settings-ui/src/redux/constants";

import { OPTIMIZE_STORE_KEY } from "../constants";
import {
	ADD_NOTIFICATION,
	REMOVE_NOTIFICATION,
	ADD_RELATED_KEYPHRASE,
	GET_DETAIL,
	GET_DETAIL_ERROR,
	GET_DETAIL_REQUEST,
	GET_DETAIL_SUCCESS,
	HANDLE_MORE_RESULTS_QUERY_ERROR,
	HANDLE_MORE_RESULTS_QUERY_REQUEST,
	HANDLE_MORE_RESULTS_QUERY_SUCCESS,
	HANDLE_QUERY,
	HANDLE_QUERY_ERROR,
	HANDLE_QUERY_REQUEST,
	HANDLE_QUERY_SUCCESS,
	HANDLE_ROUTE_CHANGED,
	HANDLE_SAVE,
	HANDLE_SAVE_ERROR,
	HANDLE_SAVE_REQUEST,
	HANDLE_SAVE_SUCCESS,
	REMOVE_RELATED_KEYPHRASE,
	REPLACE_ARRAY_DATA,
	RESET_DATA,
	RESET_LIST_DATA,
	RESET_MARKER,
	RUN_ANALYSIS,
	RUN_ANALYSIS_ERROR,
	RUN_ANALYSIS_REQUEST,
	RUN_ANALYSIS_SUCCESS,
	RUN_RELATED_KEYPHRASE_ANALYSIS,
	RUN_RELATED_KEYPHRASE_ANALYSIS_ERROR,
	RUN_RELATED_KEYPHRASE_ANALYSIS_REQUEST,
	RUN_RELATED_KEYPHRASE_ANALYSIS_SUCCESS,
	RUN_RESEARCH,
	RUN_RESEARCH_ERROR,
	RUN_RESEARCH_REQUEST,
	RUN_RESEARCH_SUCCESS,
	SET_ALL_QUERY_DATA,
	SET_DATA,
	SET_MARKER,
	SET_QUERY_DATA,
} from "./constants";
import { RESEARCHES } from "./reducers/analysis-research";

/**
 * An action creator for the ADD_NOTIFICATION action.
 *
 * @param {Object} notification The data to set.
 *
 * @returns {Object} The ADD_NOTIFICATION action.
 */
export function addNotification( notification ) {
	return {
		type: ADD_NOTIFICATION,
		payload: notification,
	};
}

/**
 * An action creator for the REMOVE_NOTIFICATION action.
 *
 * @param {number} id The id of the notification to remove.
 *
 * @returns {Object} The REMOVE_NOTIFICATION action.
 */
export function removeNotification( id ) {
	return {
		type: REMOVE_NOTIFICATION,
		payload: id,
	};
}

/**
 *
 * @param {string} path Path in query data to set.
 * @param {*} value New query data value.
 * @returns {{ type, payload }} Action object.
 */
export function setQueryData( path, value ) {
	return {
		type: SET_QUERY_DATA,
		payload: { path, value },
	};
}

/**
 *
 * @param {Object} payload New query data.
 * @returns {{ type, payload }} Action object.
 */
export function setAllQueryData( payload ) {
	return {
		type: SET_ALL_QUERY_DATA,
		payload,
	};
}

/**
 * Reset detail data in state to initial (empty) state.
 * @returns {{ type, payload }} Action object.
 */
export function resetData() {
	return {
		type: RESET_DATA,
	};
}

/**
 * Reset list data in state to initial (empty) state.
 * @returns {{ type, payload }} Action object.
 */
export function resetListData() {
	return {
		type: RESET_LIST_DATA,
	};
}

/**
 * An action creator for the HANDLE_QUERY action.
 *
 * @returns {Object} Either the HANDLE_QUERY_SUCCESS or the HANDLE_QUERY_ERROR action,
 *                   depending on the outcome of the query.
 */
export function* handleQuery() {
	yield { type: HANDLE_QUERY_REQUEST };

	try {
		const queryData = yield select( OPTIMIZE_STORE_KEY ).getQueryData();
		const response = yield { type: HANDLE_QUERY, payload: queryData };

		if ( response.status === 200 ) {
			return { type: HANDLE_QUERY_SUCCESS, payload: response };
		}

		return { type: HANDLE_QUERY_ERROR, payload: response };
	} catch ( error ) {
		return { type: HANDLE_QUERY_ERROR, payload: error };
	}
}

/**
 * An action creator for the more results HANDLE_QUERY action.
 *
 * @returns {Object} Either the HANDLE_MORE_RESULTS_QUERY_SUCCESS or the HANDLE_MORE_RESULTS_QUERY_ERROR action,
 *                   depending on the outcome of the query.
 */
export function* handleMoreResultsQuery() {
	yield { type: HANDLE_MORE_RESULTS_QUERY_REQUEST };

	try {
		const queryData = yield select( OPTIMIZE_STORE_KEY ).getQueryData();
		const after = yield select( OPTIMIZE_STORE_KEY ).getListData( "after" );
		const response = yield { type: HANDLE_QUERY, payload: { ...queryData, after } };

		if ( response.status === 200 ) {
			return { type: HANDLE_MORE_RESULTS_QUERY_SUCCESS, payload: response };
		}

		return { type: HANDLE_MORE_RESULTS_QUERY_ERROR, payload: response };
	} catch ( error ) {
		return { type: HANDLE_MORE_RESULTS_QUERY_ERROR, payload: error };
	}
}

/**
 * An action creator for the async HANDLE_SAVE action.
 *
 * @returns {Object} Either the HANDLE_SAVE_SUCCESS or the HANDLE_SAVE_ERROR action.
 */
export function* handleSave( { contentType, id, ...requestData } ) {
	yield { type: HANDLE_SAVE_REQUEST };

	try {
		const original = yield select( OPTIMIZE_STORE_KEY ).getOriginalData();
		const data = yield select( OPTIMIZE_STORE_KEY ).getData();
		// Add contentType to payload.
		const response = yield { type: HANDLE_SAVE, payload: { data, options: { contentType, id, ...requestData } } };

		if ( response.status === 200 ) {
			// A redirect has been automatically created if slug has changed.
			return { type: HANDLE_SAVE_SUCCESS, payload: { data, isRedirected: Boolean( data.slug !== original.slug ) } };
		}

		return { type: HANDLE_SAVE_ERROR, payload: { error: "An error occurred while saving, please try again." } };
	} catch ( error ) {
		return { type: HANDLE_SAVE_ERROR, payload: { error: error.message } };
	}
}

/**
 * An action creator for the async GET_DETAIL action.
 *
 * @returns {Object} Either the GET_DETAIL_SUCCESS or the GET_DETAIL_ERROR action.
 */
export function* getDetail( { contentType, id, ...requestData } ) {
	yield { type: GET_DETAIL_REQUEST };

	try {
		const response = yield { type: GET_DETAIL, payload: { contentType, id, ...requestData } };

		if ( response.status === 200 ) {
			return {
				type: GET_DETAIL_SUCCESS, payload: {
					data: response.data,
					metadata: response.metadata,
				},
			};
		}

		return { type: GET_DETAIL_ERROR, payload: { error: "An error occurred while getting data, please try again." } };
	} catch ( error ) {
		return { type: GET_DETAIL_ERROR, payload: { error: error.message } };
	}
}

/**
 * An action creator for the RUN_ANALYSIS action.
 *
 * @param {Object} config The config.
 * @param {string} config.contentType The content type.
 *
 * @returns {Object} Either the RUN_ANALYSIS_SUCCESS or the RUN_ANALYSIS_ERROR action,
 *                   depending on the outcome of the query.
 */
export function* runAnalysis( { contentType } ) {
	yield { type: RUN_ANALYSIS_REQUEST };

	try {
		const data = yield select( OPTIMIZE_STORE_KEY ).getAnalysisData( contentType );
		const response = yield { type: RUN_ANALYSIS, payload: { contentType, data } };

		if ( response.status === 200 ) {
			return {
				type: RUN_ANALYSIS_SUCCESS,
				payload: response.data,
			};
		}

		return { type: RUN_ANALYSIS_ERROR, payload: response };
	} catch ( error ) {
		return { type: RUN_ANALYSIS_ERROR, payload: error };
	}
}

/**
 * An action creator for the RUN_ANALYSIS action.
 *
 * @param {Object} config The config.
 * @param {string} config.contentType The content type.
 *
 * @returns {Object} Either the RUN_RELATED_KEYPHRASE_ANALYSIS_SUCCESS or the RUN_RELATED_KEYPHRASE_ANALYSIS_ERROR
 *                   action, depending on the outcome of the query.
 */
export function* runRelatedKeyphrasesAnalysis( { contentType } ) {
	yield { type: RUN_RELATED_KEYPHRASE_ANALYSIS_REQUEST };

	try {
		const data = yield select( OPTIMIZE_STORE_KEY ).getRelatedKeyphrasesAnalysisData();
		const response = yield { type: RUN_RELATED_KEYPHRASE_ANALYSIS, payload: { contentType, data } };

		if ( response.status === 200 ) {
			return {
				type: RUN_RELATED_KEYPHRASE_ANALYSIS_SUCCESS,
				payload: response.data,
			};
		}

		return { type: RUN_RELATED_KEYPHRASE_ANALYSIS_ERROR, payload: response };
	} catch ( error ) {
		return { type: RUN_RELATED_KEYPHRASE_ANALYSIS_ERROR, payload: error };
	}
}

/**
 *
 * @param {string} path Path in detail data to set.
 * @param {*} value New detail data value.
 * @returns {{ type, payload }} Action object.
 */
export function setData( path, value ) {
	return {
		type: SET_DATA,
		payload: { path, value },
	};
}


/**
 * An action creator for the SET_ARRAY_DATA action.
 * This action
 *
 * @param {String} path The path to the data in the store.
 * @param {*} value The value to set.
 *
 * @returns {Object} The SET_ARRAY_DATA action.
 */
export function replaceArrayData( path, value ) {
	return {
		type: REPLACE_ARRAY_DATA,
		payload: { path, value },
	};
}

/**
 * Sets the active mark.
 *
 * @param {string} id The marker ID.
 * @param {Mark[]} marks The marks.
 *
 * @returns {{payload, type: string}} The action.
 */
export function setMarker( id, marks ) {
	return {
		type: SET_MARKER,
		payload: { id, marks },
	};
}

/**
 * Resets the marker.
 *
 * @returns {{payload, type: string}} The action.
 */
export function resetMarker() {
	return {
		type: RESET_MARKER,
	};
}

/**
 * Adds a related keyphrase.
 *
 * @param {string} key The key of the keyphrase.
 * @param {string} keyphrase The keyphrase.
 *
 * @returns {{payload, type: string}} The action.
 */
export function addRelatedKeyphrase( key, keyphrase ) {
	return {
		type: ADD_RELATED_KEYPHRASE,
		payload: { key, keyphrase },
	};
}

/**
 * Removes a related keyphrase.
 *
 * @param {string} key The key of the keyphrase.
 *
 * @returns {{payload, type: string}} The action.
 */
export function removeRelatedKeyphrase( key ) {
	return {
		type: REMOVE_RELATED_KEYPHRASE,
		payload: key,
	};
}

/**
 * An action creator for the RUN_RESEARCH action.
 *
 * @param {Object} config The config.
 * @param {string} config.contentType The content type.
 * @param {Object} config.data The data.
 *
 * @returns {Object} Either the RUN_RESEARCH_SUCCESS or the RUN_RESEARCH_ERROR action,
 *                   depending on the outcome of the query.
 */
function* runResearch( { contentType, data } ) {
	yield { type: RUN_RESEARCH_REQUEST };
	const payload = { research: data.research };

	try {
		const response = yield { type: RUN_RESEARCH, payload: { contentType, data } };

		if ( response.status === 200 ) {
			payload.data = response.data;
			return {
				type: RUN_RESEARCH_SUCCESS,
				payload,
			};
		}

		payload.data = response;
		return { type: RUN_RESEARCH_ERROR, payload };
	} catch ( error ) {
		payload.data = error;
		return { type: RUN_RESEARCH_ERROR, payload };
	}
}

/**
 * Runs the word forms research on the focus keyphrase.
 *
 * @param {Object} config The config.
 * @param {string} config.contentType The content type.
 *
 * @returns {Object} The `runResearch` result.
 */
export function* runWordFormsResearch( { contentType } ) {
	const data = yield select( OPTIMIZE_STORE_KEY ).getAnalysisData( contentType );

	// Note that this return value is really needed, to have the last delegated yield be picked up by the dispatch.
	return yield* runResearch( { contentType, data: { ...data, research: RESEARCHES.MORPHOLOGY } } );
}

/**
 * Creates the action to notify that the route has changed.
 *
 * @param {Object} location The new location.
 *
 * @returns {{type: string}} The action.
 */
export function* handleRouteChanged( location ) {
	yield { type: HANDLE_ROUTE_CHANGED_REQUEST };

	try {
		yield { type: HANDLE_ROUTE_CHANGED, payload: location };

		return { type: HANDLE_ROUTE_CHANGED_SUCCESS, payload: { location } };
	} catch ( error ) {
		return { type: HANDLE_ROUTE_CHANGED_ERROR, payload: { location, error } };
	}
}
