import { createSlice } from "@reduxjs/toolkit";
import { FOCUS_ID } from "../constants";

export const TARGETS_SLICE_NAME = "targets";

const initialState = {
	keyphrases: {
		[ FOCUS_ID ]: "",
	},
	synonyms: {
		[ FOCUS_ID ]: "",
	},
};

const targets = createSlice( {
	name: TARGETS_SLICE_NAME,
	initialState,
	reducers: {
		updateKeyphrase: ( state, action ) => {
			state.keyphrases[ action.payload.id || FOCUS_ID ] = action.payload.keyphrase;
		},
	},
} );

export const targetsSelectors = {
	selectTargets: state => state,
	selectKeyphrases: state => state[ TARGETS_SLICE_NAME ].keyphrases,
	selectSynonyms: state => state[ TARGETS_SLICE_NAME ].synonyms,
	selectKeyphrase: ( state, id = FOCUS_ID ) => state[ TARGETS_SLICE_NAME ].keyphrases[ id ],
	selectKeyphraseSynonyms: ( state, id = FOCUS_ID ) => state[ TARGETS_SLICE_NAME ].synonyms[ id ],
};

export const targetsActions = targets.actions;

export default targets.reducer;
