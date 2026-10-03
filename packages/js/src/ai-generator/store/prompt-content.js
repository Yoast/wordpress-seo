import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const PROMPT_CONTENT_NAME = "promptContent";

const slice = createSlice( {
	name: PROMPT_CONTENT_NAME,
	initialState: {
		content: "",
		initialized: false,
	},
	reducers: {
		setPromptContent: ( state, { payload } ) => ( {
			content: payload,
			initialized: true,
		} ),
	},
} );

export const getInitialPromptContentState = slice.getInitialState;

export const promptContentSelectors = {
	selectPromptContent: state => get( state, `${ PROMPT_CONTENT_NAME }.content`, "" ),
	selectPromptContentInitialized: state => get( state, `${ PROMPT_CONTENT_NAME }.initialized`, false ),
};

export const promptContentActions = slice.actions;

export const promptContentReducer = slice.reducer;
