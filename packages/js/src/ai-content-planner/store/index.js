import { combineReducers, createReduxStore } from "@wordpress/data";
import {
	SUGGESTIONS_NAME,
	getInitialSuggestionsState,
	suggestionsActions,
	suggestionsControls,
	suggestionsReducer,
	suggestionsSelectors,
} from "./suggestions";

export const STORE_NAME = "yoast-seo/content-planner";

export const store = createReduxStore( STORE_NAME, {
	actions: {
		...suggestionsActions,
	},
	selectors: {
		...suggestionsSelectors,
	},
	initialState: {
		[ SUGGESTIONS_NAME ]: getInitialSuggestionsState(),
	},
	reducer: combineReducers( {
		[ SUGGESTIONS_NAME ]: suggestionsReducer,
	} ),
	controls: {
		...suggestionsControls,
	},
} );
