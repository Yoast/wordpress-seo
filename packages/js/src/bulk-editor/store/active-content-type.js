import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

/**
 * @returns {string} The initial active content type name: empty, meaning "the first available content type".
 */
export const createInitialActiveContentTypeState = () => "";

/*
 * The reducer stores the name as-is: the valid names come from the data provider at runtime, so it cannot
 * validate them. The app resolves an empty or unknown name to the first available content type.
 */
const slice = createSlice( {
	name: "activeContentType",
	initialState: createInitialActiveContentTypeState(),
	reducers: {
		setActiveContentType: ( state, { payload } ) => payload,
	},
} );

export const activeContentTypeSelectors = {
	selectActiveContentTypeName: ( state ) => get( state, "activeContentType", "" ),
};

export const activeContentTypeActions = slice.actions;

export default slice.reducer;
