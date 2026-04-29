import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const AVAILABILITY_NAME = "availability";

const slice = createSlice( {
	name: AVAILABILITY_NAME,
	initialState: {
		minPostsMet: false,
	},
	reducers: {},
} );

export const getInitialAvailabilityState = slice.getInitialState;

export const availabilityReducer = slice.reducer;

export const availabilityActions = {
	...slice.actions,
};

export const availabilitySelectors = {
	selectIsMinPostsMet: ( state ) => get( state, [ AVAILABILITY_NAME, "minPostsMet" ], slice.getInitialState().minPostsMet ),
};
