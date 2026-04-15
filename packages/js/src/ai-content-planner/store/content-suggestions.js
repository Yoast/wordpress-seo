import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../shared-admin/constants";
import { contentPlannerFetch } from "../helpers/fetch";

export const CONTENT_SUGGESTIONS_NAME = "contentSuggestions";
export const FETCH_CONTENT_SUGGESTIONS_ACTION_NAME = "fetchContentSuggestions";

const slice = createSlice( {
	name: CONTENT_SUGGESTIONS_NAME,
	initialState: {
		status: ASYNC_ACTION_STATUS.idle,
		suggestions: [],
		error: null,
	},
	reducers: {},
	extraReducers: ( builder ) => {
		builder.addCase( `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, ( state ) => {
			state.status = ASYNC_ACTION_STATUS.loading;
			state.error = null;
		} );
		builder.addCase( `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.success;
			state.suggestions = payload;
		} );
		builder.addCase( `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.error;
			state.error = payload;
		} );
	},
} );

export const getInitialContentSuggestionsState = slice.getInitialState;

export const contentSuggestionsSelectors = {
	selectContentSuggestionsStatus: ( state ) => get( state, [ CONTENT_SUGGESTIONS_NAME, "status" ], slice.getInitialState().status ),
	selectContentSuggestions: ( state ) => get( state, [ CONTENT_SUGGESTIONS_NAME, "suggestions" ], slice.getInitialState().suggestions ),
	selectContentSuggestionsError: ( state ) => get( state, [ CONTENT_SUGGESTIONS_NAME, "error" ], slice.getInitialState().error ),
};

/**
 * @param {string} endpoint The endpoint to fetch content suggestions from.
 * @returns {Object} Success or error action object.
 */
export function* getContentSuggestions( endpoint ) {
	yield{ type: `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		const payload = yield{ type: FETCH_CONTENT_SUGGESTIONS_ACTION_NAME, payload: { endpoint } };
		yield{ type: `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, payload };
	} catch ( error ) {
		yield{ type: `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, payload: error };
	}
}

export const contentSuggestionsActions = {
	...slice.actions,
	getContentSuggestions,
};

export const contentSuggestionsControls = {
	[ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME ]: async( { payload } ) => contentPlannerFetch( {
		path: payload.endpoint,
	} ),
};

export const contentSuggestionsReducer = slice.reducer;
