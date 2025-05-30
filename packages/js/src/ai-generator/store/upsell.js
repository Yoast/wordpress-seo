import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const UPSELL = "upsell";

const slice = createSlice( {
	name: UPSELL,
	initialState: {
		isUpsellOpen: true,
	},
	reducers: {
		hideUpsell: ( state ) => {
			state.isUpsellOpen = false;
		},
	},
} );

export const getInitialUpsellState = slice.getInitialState;

export const upsellSelectors = {
	selectIsUpsellOpen: state => get( state, [ UPSELL, "isUpsellOpen" ], getInitialUpsellState() ),
};

export const upsellActions = slice.actions;

export const upsellReducer = slice.reducer;
