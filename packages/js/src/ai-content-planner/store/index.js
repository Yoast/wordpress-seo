import { combineReducers, createReduxStore } from "@wordpress/data";
import { CONTENT_PLANNER_STORE } from "../constants";
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
import {
	MODAL_NAME,
	modalActions,
	modalReducer,
	modalSelectors,
	getInitialModalState,
} from "./modal";

export const store = createReduxStore( CONTENT_PLANNER_STORE, {
	actions: {
		...contentSuggestionsActions,
		...contentOutlineActions,
		...modalActions,
	},
	selectors: {
		...contentSuggestionsSelectors,
		...contentOutlineSelectors,
		...modalSelectors,
	},
	controls: {
		...contentSuggestionsControls,
		...contentOutlineControls,
	},
	initialState: {
		[ CONTENT_SUGGESTIONS_NAME ]: getInitialContentSuggestionsState(),
		[ CONTENT_OUTLINE_NAME ]: getInitialContentOutlineState(),
		[ MODAL_NAME ]: getInitialModalState(),
	},
	reducer: combineReducers( {
		[ CONTENT_SUGGESTIONS_NAME ]: contentSuggestionsReducer,
		[ CONTENT_OUTLINE_NAME ]: contentOutlineReducer,
		[ MODAL_NAME ]: modalReducer,
	} ),
} );
