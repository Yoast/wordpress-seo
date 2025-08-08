import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

// Action name constants
export const LLMS_TXT_NAME = "llmsTxt";

/**
 * @returns {Object} The initial llmsTxt state.
 */
export const createInitialLlmsTxtState = () =>(
	{
		generationFailure: false,
		generationFailureReason: "",
		llmsTxtUrl: "",
		disabledPageIndexables: false,
		otherIncludedPagesLimit: 100,
	}
);

const slice = createSlice( {
	name: LLMS_TXT_NAME,
	initialState: createInitialLlmsTxtState(),
	reducers: {
		setGenerationFailure: ( state, { payload } ) => {
			state.generationFailure = payload.generationFailure;
			state.generationFailureReason = payload.generationFailureReason;
		},
	},
} );

export const llmsTxtActions = slice.actions;

export const llmsTxtSelectors = {
	selectLlmsTxtGenerationFailure: state => get( state, "llmsTxt.generationFailure", false ),
	selectLlmsTxtGenerationFailureReason: state => get( state, "llmsTxt.generationFailureReason", "" ),
	selectLlmsTxtUrl: state => get( state, "llmsTxt.llmsTxtUrl", "" ),
	selectLlmsTxtDisabledPageIndexables: state => get( state, "llmsTxt.disabledPageIndexables", false ),
	selectLlmsTxtOtherIncludedPagesLimit: state => get( state, "llmsTxt.otherIncludedPagesLimit", 100 ),
};

export default slice.reducer;
