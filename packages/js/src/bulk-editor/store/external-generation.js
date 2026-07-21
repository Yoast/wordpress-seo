import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

/**
 * @returns {boolean} The initial external-generation state.
 */
export const createInitialExternalGenerationState = () => false;

const slice = createSlice( {
	name: "externalGeneration",
	initialState: createInitialExternalGenerationState(),
	reducers: {
		// An external plugin (e.g. Premium's AI suggestions) reports whether it has pending AI requests.
		setHasExternalGeneration: ( state, { payload } ) => Boolean( payload ),
	},
} );

export const externalGenerationSelectors = {
	selectHasExternalGeneration: ( state ) => get( state, "externalGeneration", false ),
};

export const externalGenerationActions = slice.actions;

export default slice.reducer;
