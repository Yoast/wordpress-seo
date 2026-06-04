import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

/**
 * @returns {string} The initial active content type name: empty, meaning "the first available content type".
 */
export const createInitialActiveContentTypeState = () => "";

/*
 * Unlike the field sets, the valid content type names are not known statically (they come from the data
 * provider), so the reducer cannot guard the payload. The app resolves unknown names by falling back to the
 * first available content type.
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
