import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

/**
 * @returns {Object} The initial llmsTxt state from wpseoScriptData.
 */
export const createInitialLlmsTxtState = () => get(window, "wpseoScriptData.llmsTxt", {});

const slice = createSlice({
    name: "llmsTxt",
    initialState: createInitialLlmsTxtState(),
    reducers: {},
});

export const llmsTxtActions = slice.actions;

export const llmsTxtSelectors = {
    selectLlmsTxtConfigs: state => get(state, "llmsTxt", {}),
	selectLlmsTxtConfig: ( state, config, defaultValue = {} ) => get( state, `llmsTxt.${ config }`, defaultValue ),
};

export default slice.reducer;