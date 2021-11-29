import { createSlice, nanoid } from "@reduxjs/toolkit";
import { get, keys } from "lodash";
import { FOCUS_KEYPHRASE_ID } from "../../common/constants";

export const MAX_RELATED_KEYPHRASES = 4;

export const defaultKeyphrasesState = {
	[ FOCUS_KEYPHRASE_ID ]: {
		id: FOCUS_KEYPHRASE_ID,
		keyphrase: "",
		synonyms: "",
	},
};

/**
 * Adds the focus keyphrase ID if no ID is given.
 * @param {Object} payload The payload.
 * @returns {Object} The payload with guaranteed ID.
 */
const prepareWithFocusKeyphraseIdFallback = ( payload ) => ( {
	payload: {
		...payload,
		id: payload.id || FOCUS_KEYPHRASE_ID,
	},
} );

const keyphrasesSlice = createSlice( {
	name: "keyphrases",
	initialState: defaultKeyphrasesState,
	reducers: {
		updateKeyphrase: {
			// Fallback to focus keyphrase if no ID is given.
			prepare: prepareWithFocusKeyphraseIdFallback,
			reducer: ( state, action ) => {
				// Ignore update request for non-existing keyphrases.
				if ( ! state[ action.payload.id ] ) {
					return state;
				}
				state[ action.payload.id ].keyphrase = action.payload.keyphrase;
			},
		},
		updateSynonyms: {
			// Fallback to focus keyphrase if no ID is given.
			prepare: prepareWithFocusKeyphraseIdFallback,
			reducer: ( state, action ) => {
				// Ignore update request for non-existing keyphrases.
				if ( ! state[ action.payload.id ] ) {
					return state;
				}
				state[ action.payload.id ].synonyms = action.payload.synonyms;
			},
		},
		addRelatedKeyphrase: {
			// Generate an ID if missing.
			prepare: ( payload = {} ) => ( {
				payload: {
					...payload,
					id: payload.id || nanoid(),
				},
			} ),
			reducer: ( state, action ) => {
				// Only add keyphrases when there are less than the max (plus the focus keyphrase).
				if ( keys( state ).length > MAX_RELATED_KEYPHRASES ) {
					return state;
				}

				state[ action.payload.id ] = {
					id: action.payload.id,
					keyphrase: action.payload.keyphrase ?? "",
					synonyms: action.payload.synonyms ?? "",
				};
			},
		},
	},
} );

export const keyphrasesSelectors = {
	selectKeyphrases: state => get( state, "form.keyphrases", {} ),
	selectKeyphrase: ( state, id = FOCUS_KEYPHRASE_ID ) => get( state, `form.keyphrases.${ id }.keyphrase` ),
	selectSynonyms: ( state, id = FOCUS_KEYPHRASE_ID ) => get( state, `form.keyphrases.${ id }.synonyms` ),
	selectKeyphraseIds: ( state ) => keys( get( state, "form.keyphrases" ) ),
};

export const keyphrasesActions = keyphrasesSlice.actions;

export default keyphrasesSlice.reducer;
