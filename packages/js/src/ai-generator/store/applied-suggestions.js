import { createSelector, createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const APPLIED_SUGGESTIONS_NAME = "appliedSuggestions";

const slice = createSlice( {
	name: APPLIED_SUGGESTIONS_NAME,
	initialState: {},
	reducers: {
		addAppliedSuggestion: ( state, { payload: { editType, previewType, suggestion } } ) => {
			state[ previewType ] = {
				...state[ previewType ],
				[ editType ]: suggestion,
			};
		},
	},
} );

export const getInitialAppliedSuggestionsState = slice.getInitialState;

export const appliedSuggestionsSelectors = {
	selectAppliedSuggestions: state => get( state, APPLIED_SUGGESTIONS_NAME, {} ),
};
appliedSuggestionsSelectors.selectAppliedSuggestionFor = createSelector(
	[
		appliedSuggestionsSelectors.selectAppliedSuggestions,
		( state, scope ) => scope,
	],
	( suggestions, { editType, previewType } ) => get( suggestions, [ previewType, editType ], "" )
);

export const appliedSuggestionsActions = slice.actions;

export const appliedSuggestionsReducer = slice.reducer;
