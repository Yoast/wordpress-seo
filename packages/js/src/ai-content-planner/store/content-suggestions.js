import { createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";
import { get, isArray } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../shared-admin/constants";

export const CONTENT_SUGGESTIONS_NAME = "contentSuggestions";
export const FETCH_CONTENT_SUGGESTIONS_ACTION_NAME = "fetchContentPlannerSuggestions";

const ERROR_DEFAULT = {
	errorCode: null,
	errorIdentifier: null,
	errorMessage: null,
};

const slice = createSlice( {
	name: CONTENT_SUGGESTIONS_NAME,
	initialState: {
		endpoint: "",
		status: ASYNC_ACTION_STATUS.idle,
		suggestions: [],
		error: ERROR_DEFAULT,
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, ( state ) => {
			state.status = ASYNC_ACTION_STATUS.loading;
			state.suggestions = [];
			state.error = ERROR_DEFAULT;
		} );
		builder.addCase( `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.success;
			state.suggestions = payload;
			state.error = ERROR_DEFAULT;
		} );
		builder.addCase( `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.error;
			// Bad gateway error will not have a payload, so we set a default error.
			state.error = {
				errorCode: 502,
				...payload,
			};
		} );
	},
} );

export const getInitialContentSuggestionsState = slice.getInitialState;

export const contentSuggestionsSelectors = {
	selectContentSuggestionsEndpoint: ( state ) => get( state, [ CONTENT_SUGGESTIONS_NAME, "endpoint" ], slice.getInitialState().endpoint ),
	selectSuggestionsStatus: ( state ) => get( state, [ CONTENT_SUGGESTIONS_NAME, "status" ], slice.getInitialState().status ),
	selectSuggestions: ( state ) => get( state, [ CONTENT_SUGGESTIONS_NAME, "suggestions" ], slice.getInitialState().suggestions ),
	selectSuggestionsError: ( state ) => get( state, [ CONTENT_SUGGESTIONS_NAME, "error" ], slice.getInitialState().error ),
};
/**
 * Validates and transforms the API response into the expected suggestions shape.
 *
 * @param {Object} result The raw API response.
 *
 * @returns {Array} The validated and transformed suggestions array.
 */
const validateSuggestionsResponse = ( result ) => {
	const suggestions = get( result, "suggestions", null );

	if ( ! isArray( suggestions ) ) {
		throw new Error( "Invalid suggestions response: expected an array of suggestions." );
	}

	return suggestions.map( ( suggestion ) => ( {
		intent: suggestion.intent,
		title: suggestion.title,
		explanation: suggestion.explanation,
		keyphrase: suggestion.keyphrase,
		metaDescription: suggestion.meta_description,
		category: suggestion.category,
	} ) );
};
/**
 * Generator action to fetch content planner suggestions from the REST API.
 *
 * @param {Object} params The parameters for the fetch.
 * @param {string} params.endpoint The REST API endpoint path.
 * @param {string} params.postType The post type to get suggestions for.
 * @param {string} params.language The language the content is written in.
 * @param {string} params.editor The current editor (classic, elementor, or gutenberg).
 *
 * @returns {Object} Success or error action object.
 */
export function* fetchContentPlannerSuggestions( { endpoint, postType, language, editor } ) {
	yield{ type: `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		// Throws an error if the response structure is invalid.
		const payload = validateSuggestionsResponse(
			// Trigger the fetch suggestions control flow.
			yield{ type: FETCH_CONTENT_SUGGESTIONS_ACTION_NAME, payload: { endpoint, postType, language, editor } }
		);

		return {
			type: `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`,
			payload,
		};
	} catch ( error ) {
		return { type: `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, payload: error };
	}
}

export const contentSuggestionsActions = {
	...slice.actions,
	fetchContentPlannerSuggestions,
};

export const contentSuggestionsControls = {
	[ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME ]: async( { payload } ) => {
		const path = addQueryArgs( payload.endpoint, {
			// eslint-disable-next-line camelcase
			post_type: payload.postType,
			language: payload.language,
			editor: payload.editor,
		} );
		return apiFetch( { path } );
	},
};

export const contentSuggestionsReducer = slice.reducer;
