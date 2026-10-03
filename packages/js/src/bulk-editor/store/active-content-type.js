import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

/**
 * @returns {string} The initial active content type name: empty, meaning "the first available content type".
 */
export const createInitialActiveContentTypeState = () => "";

const slice = createSlice( {
	name: "activeContentType",
	initialState: createInitialActiveContentTypeState(),
	reducers: {
		// The name isn't validated here: the valid content type names are runtime data from the data
		// provider, so the store can't know them. The app resolves an empty or unknown name to the first
		// available content type.
		setActiveContentType: ( state, { payload } ) => payload,
	},
} );

export const activeContentTypeSelectors = {
	selectActiveContentTypeName: ( state ) => get( state, "activeContentType", "" ),
};

export const activeContentTypeActions = slice.actions;

export default slice.reducer;
