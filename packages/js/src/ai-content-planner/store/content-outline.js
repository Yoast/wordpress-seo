import { createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { get } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../shared-admin/constants";

export const CONTENT_OUTLINE_NAME = "contentOutline";
export const FETCH_CONTENT_OUTLINE_ACTION_NAME = "fetchContentOutline";

const INITIAL_OUTLINE = {
	title: "",
	metaDescription: "",
	focusKeyphrase: "",
	heading1: "",
	paragraph1ContentNotes: [],
	heading2: "",
	paragraph2ContentNotes: [],
	heading3: "",
	paragraph3ContentNotes: [],
	heading4: "",
	paragraph4ContentNotes: [],
	heading5: "",
	paragraph5ContentNotes: [],
	heading6: "",
	paragraph6ContentNotes: [],
	faqContentNotes: [],
};

const slice = createSlice( {
	name: CONTENT_OUTLINE_NAME,
	initialState: {
		status: ASYNC_ACTION_STATUS.idle,
		outline: INITIAL_OUTLINE,
		error: null,
	},
	reducers: {},
	extraReducers: ( builder ) => {
		builder.addCase( `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, ( state ) => {
			state.status = ASYNC_ACTION_STATUS.loading;
			state.error = null;
		} );
		builder.addCase( `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.success;
			state.outline = payload;
		} );
		builder.addCase( `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.error;
			state.error = payload;
		} );
	},
} );

export const getInitialContentOutlineState = slice.getInitialState;

export const contentOutlineSelectors = {
	selectContentOutlineStatus: ( state ) => get( state, [ CONTENT_OUTLINE_NAME, "status" ], slice.getInitialState().status ),
	selectContentOutline: ( state ) => get( state, [ CONTENT_OUTLINE_NAME, "outline" ], slice.getInitialState().outline ),
	selectContentOutlineError: ( state ) => get( state, [ CONTENT_OUTLINE_NAME, "error" ], slice.getInitialState().error ),
};

/**
 * @param {string} endpoint The endpoint to fetch the content outline from.
 * @param {string} title The title of the selected suggestion.
 * @param {string} description The description of the selected suggestion.
 * @param {string} intent The intent of the selected suggestion.
 * @returns {Object} Success or error action object.
 */
export function* getContentOutline( { endpoint, title, description, intent } ) {
	yield{ type: `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		const payload = yield{ type: FETCH_CONTENT_OUTLINE_ACTION_NAME, payload: { endpoint, title, description, intent } };
		return { type: `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, payload };
	} catch ( error ) {
		return { type: `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, payload: error };
	}
}

export const contentOutlineActions = {
	...slice.actions,
	getContentOutline,
};

// eslint-disable-next-line no-warning-comments
// TODO: Replace with real apiFetch call once endpoint is available.
// export const contentOutlineControls = {
// 	[ FETCH_CONTENT_OUTLINE_ACTION_NAME ]: async( { payload } ) => apiFetch( {
// 		method: "POST",
// 		path: payload.endpoint,
// 		data: {
// 			title: payload.title,
// 			description: payload.description,
// 			intent: payload.intent,
// 		},
// 	} ),
// };
export const contentOutlineControls = {
	[ FETCH_CONTENT_OUTLINE_ACTION_NAME ]: async() => ( {
		title: "The complete guide to sourdough bread",
		metaDescription: "Learn how to bake sourdough bread at home, from making your starter to baking your first loaf.",
		focusKeyphrase: "sourdough bread",
		heading1: "What is sourdough bread?",
		paragraph1ContentNotes: [
			"Explain how sourdough differs from other breads by using wild yeast fermentation.",
			"Mention the long fermentation process and how it develops flavour and texture.",
		],
		heading2: "How to make a sourdough starter",
		paragraph2ContentNotes: [
			"Describe the flour and water ratio needed to create a starter from scratch.",
			"Explain how to feed and maintain the starter over several days until it is active.",
		],
		heading3: "Choosing the right flour",
		paragraph3ContentNotes: [
			"Compare bread flour, whole wheat, and rye and their effect on the final loaf.",
			"Advise on why higher protein flour produces better structure and rise.",
		],
		heading4: "Mixing and shaping the dough",
		paragraph4ContentNotes: [
			"Walk through the stretch-and-fold technique used instead of traditional kneading.",
			"Explain how to shape a boule or batard and build surface tension.",
		],
		heading5: "Bulk fermentation and proofing",
		paragraph5ContentNotes: [
			"Describe what to look for to know when bulk fermentation is complete.",
			"Explain the cold proof in the fridge and how it improves flavour and scoring.",
		],
		heading6: "Baking your sourdough loaf",
		paragraph6ContentNotes: [
			"Explain the importance of baking in a Dutch oven to trap steam for a crispy crust.",
			"Give temperature and timing guidance for the covered and uncovered baking stages.",
		],
		faqContentNotes: [
			"Include common questions such as why the bread is dense or why the crust is too thick.",
			"Address questions about storing sourdough and how long it keeps fresh.",
		],
	} ),
};

export const contentOutlineReducer = slice.reducer;
