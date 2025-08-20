import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const CURRENT_PROMOTIONS_NAME = "currentPromotions";

const slice = createSlice( {
	name: CURRENT_PROMOTIONS_NAME,
	initialState: { promotions: [] },
	reducers: {
		setCurrentPromotions: ( state, { payload } ) => {
			state.promotions = payload;
		},
	},
} );

export const getInitialCurrentPromotionsState = slice.getInitialState;

export const currentPromotionsSelectors = {
	isPromotionActive: ( state, promoId ) => get( state, [ CURRENT_PROMOTIONS_NAME, "promotions" ], [] ).includes( promoId ),
};


export const currentPromotionsActions = slice.actions;

export const currentPromotionsReducer = slice.reducer;
