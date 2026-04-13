import { combineReducers, createReduxStore } from "@wordpress/data";
import {
	CONTENT_SUGGESTIONS_NAME,
	contentSuggestionsActions,
	contentSuggestionsControls,
	contentSuggestionsReducer,
	contentSuggestionsSelectors,
	getInitialContentSuggestionsState,
} from "./content-suggestions";
import {
	CONTENT_OUTLINE_NAME,
	contentOutlineActions,
	contentOutlineControls,
	contentOutlineReducer,
	contentOutlineSelectors,
	getInitialContentOutlineState,
} from "./content-outline";

export const STORE_NAME = "yoast-seo/post-planner";

export const store = createReduxStore( STORE_NAME, {
	actions: {
		...contentSuggestionsActions,
		...contentOutlineActions,
	},
	selectors: {
		...contentSuggestionsSelectors,
		...contentOutlineSelectors,
	},
	controls: {
		...contentSuggestionsControls,
		...contentOutlineControls,
	},
	initialState: {
		[ CONTENT_SUGGESTIONS_NAME ]: getInitialContentSuggestionsState(),
		[ CONTENT_OUTLINE_NAME ]: getInitialContentOutlineState(),
	},
	reducer: combineReducers( {
		[ CONTENT_SUGGESTIONS_NAME ]: contentSuggestionsReducer,
		[ CONTENT_OUTLINE_NAME ]: contentOutlineReducer,
	} ),
} );
