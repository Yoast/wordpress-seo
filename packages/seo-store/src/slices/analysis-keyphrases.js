import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { FOCUS_KEYPHRASE_ID } from "../constants";

export const KEYPHRASES_SLICE_NAME = "keyphrases";

const initialState = {
	[ FOCUS_KEYPHRASE_ID ]: {
		keyphrase: "",
		synonyms: "",
	},
};

const keyphrases = createSlice( {
	name: KEYPHRASES_SLICE_NAME,
	initialState,
	reducers: {
		updateKeyphrase: ( state, action ) => {
			state[ action.payload.id || FOCUS_KEYPHRASE_ID ] = action.payload.keyphrase;
		},
	},
} );

export const keyphrasesSelectors = {
	selectKeyphrases: state => get( state, KEYPHRASES_SLICE_NAME, {} ),
	selectKeyphrase: ( state, id = FOCUS_KEYPHRASE_ID ) => get( state, [ KEYPHRASES_SLICE_NAME, id, "keyphrase" ], "" ),
	selectSynonyms: ( state, id = FOCUS_KEYPHRASE_ID ) => get( state, [ KEYPHRASES_SLICE_NAME, id, "synonyms" ], "" ),
};

export const keyphrasesActions = keyphrases.actions;

export default keyphrases.reducer;
