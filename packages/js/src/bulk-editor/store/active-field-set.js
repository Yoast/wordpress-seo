import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { FIELD_SET_SEARCH } from "../constants";

/**
 * @returns {string} The initial active field set.
 */
export const createInitialActiveFieldSetState = () => FIELD_SET_SEARCH;

const slice = createSlice( {
	name: "activeFieldSet",
	initialState: createInitialActiveFieldSetState(),
	reducers: {
		setActiveFieldSet: ( state, { payload } ) => payload,
	},
} );

export const activeFieldSetSelectors = {
	selectActiveFieldSet: ( state ) => get( state, "activeFieldSet", FIELD_SET_SEARCH ),
};

export const activeFieldSetActions = slice.actions;

export default slice.reducer;
