import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const APPLIED_FIXES_STATUS_NAME = "appliedFixesStatus";

const slice = createSlice( {
	name: APPLIED_FIXES_STATUS_NAME,
	initialState: false,
	reducers: {
		setAreFixesApplied: ( state, { payload } ) => payload,
	},
} );

export const getInitialAppliedFixesStatusState = slice.getInitialState;

export const appliedFixesStatusSelectors = {
	areFixesApplied: state => get( state, APPLIED_FIXES_STATUS_NAME, "" ),
};

export const appliedFixesStatusActions = slice.actions;

export const appliedFixesStatusReducer = slice.reducer;
