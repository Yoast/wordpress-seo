import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { activeContentTypeActions } from "./active-content-type";
import { FIELD_SET_IMAGE_ALT_TEXT, FIELD_SET_SEARCH, FIELD_SET_SOCIAL, PRODUCT_CONTENT_TYPE } from "../constants";

const FIELD_SETS = [ FIELD_SET_SEARCH, FIELD_SET_SOCIAL, FIELD_SET_IMAGE_ALT_TEXT ];

/**
 * @returns {string} The initial active field set.
 */
export const createInitialActiveFieldSetState = () => FIELD_SET_SEARCH;

const slice = createSlice( {
	name: "activeFieldSet",
	initialState: createInitialActiveFieldSetState(),
	reducers: {
		// Ignore unknown ids: an invalid active field set would leave no tab selected or focusable.
		setActiveFieldSet: ( state, { payload } ) => ( FIELD_SETS.includes( payload ) ? payload : state ),
	},
	extraReducers: ( builder ) => {
		// The image-alt-text tab only exists for products; leaving products while it's active would
		// otherwise leave the tab list with no active/focusable tab (that id isn't in the new content
		// type's tab list), so fall back to the Search tab.
		builder.addCase( activeContentTypeActions.setActiveContentType, ( state, { payload } ) =>
			( state === FIELD_SET_IMAGE_ALT_TEXT && payload !== PRODUCT_CONTENT_TYPE ) ? FIELD_SET_SEARCH : state
		);
	},
} );

export const activeFieldSetSelectors = {
	selectActiveFieldSet: ( state ) => get( state, "activeFieldSet", FIELD_SET_SEARCH ),
};

export const activeFieldSetActions = slice.actions;

export default slice.reducer;
