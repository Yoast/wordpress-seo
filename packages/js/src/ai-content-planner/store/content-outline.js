import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../shared-admin/constants";
import { ERROR_DEFAULT } from "../constants";
import { contentPlannerFetch } from "../helpers/fetch";
import { normalizeError } from "../helpers/normalize-error";
import { FETCH_CONTENT_SUGGESTIONS_ACTION_NAME } from "./content-suggestions";

export const CONTENT_OUTLINE_NAME = "contentOutline";
export const FETCH_CONTENT_OUTLINE_ACTION_NAME = "fetchContentOutline";

/**
 * @typedef {import( "../constants" ).Suggestion} Suggestion
 */

/**
 * @typedef {Object} StructureItem
 * @property {string} id The unique identifier for this structure item.
 * @property {string} heading The heading text.
 * @property {string[]} contentNotes Content notes for this section.
 */

/**
 * Initial state for the content outline slice.
 *
 * @type {Object}
 * @property {Suggestion|null} suggestion The content suggestion for which the outline is generated.
 * @property {StructureItem[]} outline The generated content outline.
 * @property {Object} cache A cache of previously generated outlines, keyed by suggestion id.
 * @property {string} endpoint The API endpoint for fetching the content outline.
 * @property {string} status The loading status of the content outline request.
 * @property {Object|null} error The error object if the content outline request failed, or null if there is no error.
 */
const INITIAL_OUTLINE = {
	suggestion: null,
	outline: [],
	cache: {},
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
		restoreContentOutlineFromCache: ( state, { payload } ) => {
			const { suggestion, outline } = payload;
			state.suggestion = suggestion;
			state.outline =  outline;
			state.status = ASYNC_ACTION_STATUS.success;
			state.error = ERROR_DEFAULT;
		},
		saveOutlineEditsToCache: ( state, { payload } ) => {
			const { id, structure } = payload;
			if ( id ) {
				state.cache[ id ] = structure;
			}
			state.suggestion = null;
			state.outline = [];
			state.status = ASYNC_ACTION_STATUS.idle;
			state.error = ERROR_DEFAULT;
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
			// Normalize the API response: the API returns snake_case keys (PHP convention),
			// which are mapped to camelCase and renamed to match the JS codebase shape (see StructureItem typedef).
			const outlineData = payload.outline.map( ( section, i ) => {
				const heading = section.subheading_text ?? "";
				return {
					id: `${ i }-${ heading }`,
					heading,
					contentNotes: section.content_notes ?? [],
				};
			} );
			state.outline = outlineData;
		} );
		builder.addCase( `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.error;
			state.error = normalizeError( payload );
		} );
		builder.addCase( `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, ( state ) => {
			return { ...INITIAL_OUTLINE, endpoint: state.endpoint };
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
	selectContentOutlineCache: ( state, id ) => get( state, [ CONTENT_OUTLINE_NAME, "cache", id ], null ),
};

/**
 * @param {string}   endpoint      The endpoint to fetch the content outline from.
 * @param {string}   postType      The type of the post.
 * @param {string}   language      The language of the post.
 * @param {string}   editor        The editor instance.
 * @param {Suggestion} suggestion  The suggestion object containing details for the content outline.
 * @param {Object[]} recentContent The recent content from the suggestions response.
 * @returns {Object} Success or error action object.
 */
export function* fetchContentOutline( {
	endpoint, postType, language, editor, suggestion, recentContent,
} ) {
	yield{ type: `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, payload: { suggestion } };
	try {
		const payload = yield{ type: FETCH_CONTENT_OUTLINE_ACTION_NAME, payload: {
			endpoint,
			postType,
			language,
			editor,
			recentContent,
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
			category: payload.category,
			// eslint-disable-next-line camelcase
			recent_content: payload.recentContent,
		},
	} ),
};

export const contentOutlineReducer = slice.reducer;
