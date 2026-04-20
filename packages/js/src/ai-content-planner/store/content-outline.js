import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../shared-admin/constants";
import { ERROR_DEFAULT } from "../constants";
import { contentPlannerFetch } from "../helpers/fetch";
import { normalizeError } from "../helpers/normalize-error";

export const CONTENT_OUTLINE_NAME = "contentOutline";
export const FETCH_CONTENT_OUTLINE_ACTION_NAME = "fetchContentOutline";

/**
 * @typedef {import( "../constants" ).Suggestion} Suggestion
 */

/**
 * Type of on section in the outline structure.
 * @typedef {Object} OutlineSection
 * @property {string} subheading_text The title of the section.
 * @property {string[]} content_notes Content notes for the section.
 */

/**
 * Initial state for the content outline slice.
 *
 * @type {Object}
 * @property {Suggestion|null} suggestion The content suggestion for which the outline is generated.
 * @property {OutlineSection[]} outline The generated content outline.
 * @property {string} endpoint The API endpoint for fetching the content outline.
 */
const INITIAL_OUTLINE = {
	suggestion: null,
	outline: [],
	endpoint: "",
	status: ASYNC_ACTION_STATUS.idle,
	error: ERROR_DEFAULT,
};

const slice = createSlice( {
	name: CONTENT_OUTLINE_NAME,
	initialState: INITIAL_OUTLINE,
	reducers: {
		setSuggestionForOutline: ( state, { payload } ) => {
			state.suggestion = payload;
		},
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.loading;
			state.suggestion = payload.suggestion;
			state.error = ERROR_DEFAULT;
		} );
		builder.addCase( `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.success;
			state.outline = payload.outline;
		} );
		builder.addCase( `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.error;
			state.error = normalizeError( payload );
		} );
	},
} );

export const getInitialContentOutlineState = slice.getInitialState;

export const contentOutlineSelectors = {
	selectContentOutlineEndpoint: ( state ) => get( state, [ CONTENT_OUTLINE_NAME, "endpoint" ], slice.getInitialState().endpoint ),
	selectContentOutlineStatus: ( state ) => get( state, [ CONTENT_OUTLINE_NAME, "status" ], slice.getInitialState().status ),
	selectContentOutline: ( state ) => get( state, [ CONTENT_OUTLINE_NAME, "outline" ], slice.getInitialState().outline ),
	selectContentOutlineError: ( state ) => get( state, [ CONTENT_OUTLINE_NAME, "error" ], slice.getInitialState().error ),
	selectSuggestion: ( state ) => get( state, [ CONTENT_OUTLINE_NAME, "suggestion" ], slice.getInitialState().suggestion ),
};

/**
 * @param {string} endpoint The endpoint to fetch the content outline from.
 * @param {string} postType The type of the post.
 * @param {string} language The language of the post.
 * @param {string} editor The editor instance.
 * @param {Suggestion} suggestion The suggestion object containing details for the content outline.
 * @returns {Object} Success or error action object.
 */
export function* fetchContentOutline( {
	endpoint, postType, language, editor, suggestion,
} ) {
	yield{ type: `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, payload: { suggestion } };
	try {
		const payload = yield{ type: FETCH_CONTENT_OUTLINE_ACTION_NAME, payload: {
			endpoint,
			postType,
			language,
			editor,
			...suggestion,
		} };
		yield{ type: `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, payload };
	} catch ( error ) {
		if ( error?.aborted ) {
			return;
		}
		yield{ type: `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, payload: error };
	}
}

export const contentOutlineActions = {
	...slice.actions,
	fetchContentOutline,
};

export const contentOutlineControls = {
	[ FETCH_CONTENT_OUTLINE_ACTION_NAME ]: async( { payload } ) => contentPlannerFetch( {
		method: "POST",
		path: payload.endpoint,
		data: {
			// eslint-disable-next-line camelcase
			post_type: payload.postType,
			language: payload.language,
			editor: payload.editor,
			title: payload.title,
			intent: payload.intent,
			explanation: payload.explanation,
			keyphrase: payload.keyphrase,
			// eslint-disable-next-line camelcase
			meta_description: payload.meta_description,
			category: payload?.category ?? {
				name: "Uncategorized",
				id: 1,
			},
		},
	} ),
};

export const contentOutlineReducer = slice.reducer;
