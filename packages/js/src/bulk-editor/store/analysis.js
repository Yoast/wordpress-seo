import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

/**
 * @returns {Object} The initial state.
 */
export const createInitialAnalysisState = () => ( {
	// Defaults to false so a missing localization degrades to the same "analysis off" state the field
	// scorer already assumes, rather than to a keyphrase the feature cannot support editing.
	keywordAnalysisActive: get( window, "wpseoBulkEditorData.analysis.keywordAnalysisActive", false ) === true,
} );

const slice = createSlice( {
	name: "analysis",
	initialState: createInitialAnalysisState(),
	reducers: {},
} );

export const analysisSelectors = {
	selectIsKeywordAnalysisActive: state => get( state, "analysis.keywordAnalysisActive", false ) === true,
};

export const analysisActions = slice.actions;

export default slice.reducer;
