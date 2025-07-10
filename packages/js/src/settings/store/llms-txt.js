import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

/**
 * @returns {Object} The initial llmsTxt state.
 */
export const createInitialLlmsTxtState = () =>( { generationFailure: false, generationFailureReason: "", llmsTxtUrl: "" } );

const slice = createSlice( {
	name: "llmsTxt",
	initialState: createInitialLlmsTxtState(),
	reducers: {},
} );

export const llmsTxtActions = slice.actions;

export const llmsTxtSelectors = {
	selectLlmsTxtGenerationFailure: state => get( state, "llmsTxt.generationFailure", false ),
	selectLlmsTxtGenerationFailureReason: state => get( state, "llmsTxt.generationFailureReason", "" ),
	selectLlmsTxtUrl: state => get( state, "llmsTxt.llmsTxtUrl", "" ),
	selectLlmsTxtDisabledPageIndexables: state => get( state, "llmsTxt.disabledPageIndexables", false ),
};

export default slice.reducer;
