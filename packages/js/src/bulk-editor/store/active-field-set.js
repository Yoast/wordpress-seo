import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { FIELD_SET_SEARCH, FIELD_SET_SOCIAL } from "../constants";

const FIELD_SETS = [ FIELD_SET_SEARCH, FIELD_SET_SOCIAL ];

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
} );

export const activeFieldSetSelectors = {
	selectActiveFieldSet: ( state ) => get( state, "activeFieldSet", FIELD_SET_SEARCH ),
};

export const activeFieldSetActions = slice.actions;

export default slice.reducer;
